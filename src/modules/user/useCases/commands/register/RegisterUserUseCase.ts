import { UserEmail } from './../../../domain/valueObjects/UserEmail';
import { Inject, Service } from 'typedi'
import { IUseCaseCommandCQRS } from '../../../../../shared/core/IUseCase'
import { left, Result, right } from '../../../../../shared/core/Result'
import { UserRepository } from '../../../infra/repositories/UserRepository'
import { RegisterUserCommand } from './RegisterUserCommand'
import { RegisterUserResponse } from './RegisterUserResponse'
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { RegisterUserErrors } from './RegisterUserErrors';
import { User } from '../../../domain/aggregateRoots/User';

@Service()
export class RegisterUserUseCase implements IUseCaseCommandCQRS<RegisterUserCommand, RegisterUserResponse> {
    @Inject('user.repository')
    private readonly _userRepository: UserRepository

    async handler(param: RegisterUserCommand): Promise<RegisterUserResponse> {
        const { firstName, lastName, email, password } = param
        if (!firstName)
            return left(Result.fail('The first name is required!'))
        if (!email || !password)
            return left(Result.fail('The email and password is required!'))

        const emailOrError = UserEmail.create({ value: email })
        if(emailOrError.isFailure)
            return left(Result.fail(emailOrError.error.toString()))

        try {
            const isEmailExist = await this._userRepository.getByEmail(email)
            if (isEmailExist)
                return left(new RegisterUserErrors.EmailAlreadyExist(email))

            const userOrError = User.create({
                firstName,
                lastName,
                email: emailOrError.getValue(),
                password
            })

            if (userOrError.isFailure)
                return left(Result.fail(userOrError.error.toString()))

            const user = userOrError.getValue()
            const isRegistered = await this._userRepository.create(user)
            if (!isRegistered)
                return left(new RegisterUserErrors.DataCannotSave())
            return right(Result.OK(isRegistered ? true : false))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
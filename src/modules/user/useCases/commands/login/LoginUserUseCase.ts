import { UserEmail } from './../../../domain/valueObjects/UserEmail';
import { Inject, Service } from 'typedi'
import { IUseCaseCommandCQRS } from '../../../../../shared/core/IUseCase'
import { left, Result, right } from '../../../../../shared/core/Result'
import { UserRepository } from '../../../infra/repositories/UserRepository'
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { LoginUserCommand } from './LoginUserCommand';
import { LoginUserResponse } from './LoginUserResponse';
import { LoginUserErrors } from './LoginUserErrors';
import { UserAuthenticated } from '../../../domain/UserAuthenticated';
import { RedisAuthService } from '../../../../../shared/services/auth/RedisAuthService';

@Service()
export class LoginUserUseCase implements IUseCaseCommandCQRS<LoginUserCommand, LoginUserResponse> {
    @Inject('user.repository')
    private readonly _userRepository: UserRepository

    private readonly _redisAuthService: RedisAuthService
    constructor() {
        this._redisAuthService = new RedisAuthService()
    }

    async handler(param: LoginUserCommand): Promise<LoginUserResponse> {
        const { email, password } = param
        if (!email || !password)
            return left(Result.fail('Email or password is required!'))
        const emailOrError = UserEmail.create({ value: email })
        if (emailOrError.isFailure)
            return left(Result.fail(emailOrError.error.toString()))
        try {
            const account = await this._userRepository.getByEmail(email)
            if (!account || !account.comparePassword(password))
                return left(new LoginUserErrors.AccountInvalid())
            const accessToken = this._redisAuthService.signJWT(account)
            const refreshToken = this._redisAuthService.createRefreshToken()
            account.setToken(accessToken, refreshToken)
            await this._redisAuthService.saveAuthenticatedUser(account);
            return right(Result.OK(new UserAuthenticated(accessToken, account.id.toString())))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
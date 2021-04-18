import { Response } from "express";
import Container from 'typedi';
import { BodyParam, JsonController, Post, Res } from "routing-controllers";
import { BaseController } from "../../../shared/controllers/BaseController";
import { LoginUserUseCase } from '../useCases/commands/login/LoginUserUseCase';
import { LoginUserCommand } from '../useCases/commands/login/LoginUserCommand';
import { LoginUserErrors } from '../useCases/commands/login/LoginUserErrors';

@JsonController('/v1/users')
export class RegisterUserController extends BaseController {
    constructor(
        private readonly _loginUserUseCase: LoginUserUseCase = Container.get(LoginUserUseCase)
    ) { super() }

    @Post('/login')
    async executeImpl(
        @BodyParam('email') email: string,
        @Res() res: Response,
        @BodyParam('password') password: string
    ): Promise<Response> {
        const param = new LoginUserCommand();
        param.email = email;
        param.password = password;
        try {
            const result = await this._loginUserUseCase.handler(param);
            const resultValue = result.value

            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case LoginUserErrors.AccountInvalid:
                        return this.notFound(res, resultValue.errorValue())
                    default:
                        return this.fail(res, resultValue.errorValue())
                }
            }
            else
                return this.OK(res, resultValue.getValue())
        } catch (error) {
            console.error(error)
            return this.fail(res, error)
        }
    }
}
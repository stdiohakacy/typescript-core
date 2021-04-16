import { RegisterUserUseCase } from './../useCases/commands/register/RegisterUserUseCase';
import { Response } from "express";
import Container from 'typedi';
import { Body, JsonController, Post, Res } from "routing-controllers";
import { BaseController } from "../../../shared/controllers/BaseController";
import { RegisterUserCommand } from '../useCases/commands/register/RegisterUserCommand';
import { RegisterUserErrors } from '../useCases/commands/register/RegisterUserErrors';

@JsonController('/v1/users')
export class RegisterUserController extends BaseController {
    constructor(
        private readonly _registerUserUseCase: RegisterUserUseCase = Container.get(RegisterUserUseCase)
    ) { super() }

    @Post('/register')
    async executeImpl(@Body() param: RegisterUserCommand, @Res() res: Response): Promise<Response> {
        try {
            const result = await this._registerUserUseCase.handler(param);
            const resultValue = result.value

            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case RegisterUserErrors.EmailAlreadyExist:
                        return this.conflict(res, resultValue.errorValue())
                    case RegisterUserErrors.DataCannotSave:
                        return this.fail(res, resultValue.errorValue())
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
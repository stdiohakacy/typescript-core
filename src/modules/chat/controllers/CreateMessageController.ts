import { CreateMessageUseCase } from './../useCases/message/commands/create/CreateMessageUseCase';
import { Response } from "express";
import { Authorized, Body, CurrentUser, JsonController, Post, Res } from "routing-controllers";
import Container from 'typedi';
import { BaseController } from "../../../shared/controllers/BaseController";
import { CreateMessageCommand } from '../useCases/message/commands/create/CreateMessageCommand';
import { CreateMessageErrors } from '../useCases/message/commands/create/CreateMessageErrors';
import { UserAuthenticated } from '../../user/domain/UserAuthenticated';

@JsonController('/v1/chat')
export class CreateMessageController extends BaseController {
    constructor(
        private readonly _createMessageUseCase: CreateMessageUseCase = Container.get(CreateMessageUseCase)
    ) { super() }

    @Authorized()
    @Post('/messages')
    async executeImpl(@Body() param: CreateMessageCommand, @Res() res: Response, @CurrentUser() userAuth: UserAuthenticated): Promise<Response> {
        param.fromUser = userAuth.userId
        try {
            const result = await this._createMessageUseCase.handler(param);
            const resultValue = result.value

            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case CreateMessageErrors.ChannelNotFound:
                        return this.notFound(res, resultValue.errorValue())
                    case CreateMessageErrors.DataCannotSave:
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
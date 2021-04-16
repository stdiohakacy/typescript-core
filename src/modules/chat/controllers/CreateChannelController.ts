import { Response } from "express";
import { Body, JsonController, Post, Res } from "routing-controllers";
import Container from 'typedi';
import { BaseController } from "../../../shared/controllers/BaseController";
import { CreateChannelCommand } from "../useCases/channel/commands/create/CreateChannelCommand";
import { CreateChannelErrors } from "../useCases/channel/commands/create/CreateChannelErrors";
import { CreateChannelUseCase } from "../useCases/channel/commands/create/CreateChannelUseCase";

@JsonController('/v1/chat')
export class CreateChannelController extends BaseController {
    constructor(
        private readonly _createChannelUseCase: CreateChannelUseCase = Container.get(CreateChannelUseCase)
    ) { super() }

    @Post('/channels')
    async executeImpl(@Body() param: CreateChannelCommand, @Res() res: Response): Promise<Response> {
        try {
            const result = await this._createChannelUseCase.handler(param);
            const resultValue = result.value

            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case CreateChannelErrors.NameAlreadyExist:
                        return this.conflict(res, resultValue.errorValue())
                    case CreateChannelErrors.DataCannotSave:
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
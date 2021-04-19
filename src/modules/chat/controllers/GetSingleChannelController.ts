import { Response } from "express";
import Container from 'typedi';
import { Authorized, Body, JsonController, Post, Res } from "routing-controllers";
import { BaseController } from "../../../shared/controllers/BaseController";
import { GetSingleChannelQuery } from "../useCases/channel/queries/GetSingleChannelQuery";
import { GetSingleChannelUseCase } from "../useCases/channel/queries/GetSingleChannelUseCase";
import { GetSingleChannelErrors } from "../useCases/channel/queries/GetSingleChannelErrors";

@JsonController('/v1/chat')
export class CreateChannelController extends BaseController {
    constructor(
        private readonly _getSingleChannelUseCase: GetSingleChannelUseCase = Container.get(GetSingleChannelUseCase)
    ) { super() }

    @Authorized()
    @Post('/channels/single-channel')
    async executeImpl(@Body() param: GetSingleChannelQuery, @Res() res: Response): Promise<Response> {
        try {
            const result = await this._getSingleChannelUseCase.handler(param);
            const resultValue = result.value

            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case GetSingleChannelErrors.ToUserNotFound:
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
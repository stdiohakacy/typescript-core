import { Response } from "express";
import Container from 'typedi';
import { Authorized, BodyParam, CurrentUser, JsonController, Post, Res } from "routing-controllers";
import { BaseController } from "../../../shared/controllers/BaseController";
import { GetSingleChannelQuery } from "../useCases/channel/queries/GetSingleChannelQuery";
import { GetSingleChannelUseCase } from "../useCases/channel/queries/GetSingleChannelUseCase";
import { GetSingleChannelErrors } from "../useCases/channel/queries/GetSingleChannelErrors";
import { UserAuthenticated } from "../../user/domain/UserAuthenticated";

@JsonController('/v1/chat')
export class CreateChannelController extends BaseController {
    constructor(
        private readonly _getSingleChannelUseCase: GetSingleChannelUseCase = Container.get(GetSingleChannelUseCase)
    ) { super() }

    @Authorized()
    @Post('/channels/single-channel')
    async executeImpl(@BodyParam('toUser') toUser: string, @Res() res: Response, @CurrentUser() userAuth: UserAuthenticated): Promise<Response> {
        const param = new GetSingleChannelQuery()
        param.fromUser = userAuth.userId
        param.toUser = toUser
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
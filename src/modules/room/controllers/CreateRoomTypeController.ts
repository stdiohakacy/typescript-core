import { Response } from "express";
import { Body, JsonController, Post, Res } from "routing-controllers";
import Container from 'typedi';
import { BaseController } from "../../../shared/controllers/BaseController";
import { CreateRoomTypeCommand } from "../useCases/room-type/commands/create/CreateRoomTypeCommand";
import { CreateRoomTypeErrors } from "../useCases/room-type/commands/create/CreateRoomTypeErrors";
import { CreateRoomTypeUseCase } from "../useCases/room-type/commands/create/CreateRoomTypeUseCase";

@JsonController('/v1/room')
export class CreateProductController extends BaseController {
    constructor(
        private readonly _createRoomTypeUseCase: CreateRoomTypeUseCase = Container.get(CreateRoomTypeUseCase)
    ) { super() }

    @Post('/room-type')
    async executeImpl(@Body() param: CreateRoomTypeCommand, @Res() res: Response): Promise<Response> {
        try {
            const result = await this._createRoomTypeUseCase.handler(param);
            const resultValue = result.value

            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case CreateRoomTypeErrors.NameAlreadyExist:
                        return this.conflict(res, resultValue.errorValue())
                    case CreateRoomTypeErrors.DataCannotSave:
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
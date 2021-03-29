import { Body, JsonController, Post } from "routing-controllers";
import Container from 'typedi';
import { CreateRoomTypeCommand } from "../useCases/room-type/commands/create/CreateRoomTypeCommand";
import { CreateRoomTypeErrors } from "../useCases/room-type/commands/create/CreateRoomTypeErrors";
import { CreateRoomTypeUseCase } from "../useCases/room-type/commands/create/CreateRoomTypeUseCase";

@JsonController('/v1/room')
export class CreateProductController {
    constructor(
        private readonly _createRoomTypeUseCase: CreateRoomTypeUseCase = Container.get(CreateRoomTypeUseCase)
    ) { }

    @Post('/room-type')
    async create(@Body() param: CreateRoomTypeCommand): Promise<any> {
        try {
            const result = await this._createRoomTypeUseCase.handler(param)
            const resultValue = result.value
            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case CreateRoomTypeErrors.NameAlreadyExist:
                    case CreateRoomTypeErrors.DataCannotSave:
                    default:
                }
            }
            else {
                return resultValue.getValue()
            }
        }
        catch (error) {
            console.error(error)
        }
    }
}
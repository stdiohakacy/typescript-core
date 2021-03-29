import { right } from './../../../../../../shared/core/Result';
import { CreateRoomTypeResponse } from './CreateRoomTypeResponse';
import { left, Result } from "../../../../../../shared/core/Result";
import { RoomTypeName } from "../../../../domain/valueObjects/room-type/RoomTypeName";
import { RoomTypePrice } from "../../../../domain/valueObjects/room-type/RoomTypePrice";
import { CreateRoomTypeCommand } from "./CreateRoomTypeCommand";
import { IUseCaseCommandCQRS } from '../../../../../../shared/core/IUseCase';
import { ApplicationError } from '../../../../../../shared/core/ApplicationError';
import { Inject, Service } from 'typedi';
import { CreateRoomTypeErrors } from './CreateRoomTypeErrors';
import { RoomType } from '../../../../domain/aggregateRoots/RoomType';
import { RoomTypeRepository } from '../../../../infra/repositories/RoomTypeRepository';


@Service()
export class CreateRoomTypeUseCase implements IUseCaseCommandCQRS<CreateRoomTypeCommand, CreateRoomTypeResponse> {
    @Inject('room_type.repository')
    private readonly _roomTypeRepository: RoomTypeRepository

    async handler(param?: CreateRoomTypeCommand): Promise<CreateRoomTypeResponse> {
        const nameOrError = RoomTypeName.create({ value: param.name })
        const priceOrError = RoomTypePrice.create({ value: param.price })

        const results = Result.combine([
            nameOrError,
            priceOrError
        ])

        if (results.isFailure)
            return left(Result.fail(results.error))

        const name = nameOrError.getValue()
        const price = priceOrError.getValue()

        try {
            const isNameExist = await this._roomTypeRepository.isNameExist(name.value)

            if (isNameExist)
                return left(new CreateRoomTypeErrors.NameAlreadyExist(name.value))

            const roomTypeOrError = RoomType.create({ name, price })
            if (roomTypeOrError.isFailure)
                return left(Result.fail(roomTypeOrError.error.toString()))

            const roomType = roomTypeOrError.getValue()
            const id = await this._roomTypeRepository.create(roomType)
            if (!id)
                return left(new CreateRoomTypeErrors.DataCannotSave())
            return right(Result.OK(id))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
import { Result } from "../../../../shared/core/Result";
import { AggregateRoot } from "../../../../shared/domain/AggregateRoot";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";
import { RoomTypeId } from "../entities/RoomTypeId";
import { RoomTypeCreated } from "../events/RoomTypeCreated";
import { RoomTypeName } from "../valueObjects/room-type/RoomTypeName";
import { RoomTypePrice } from "../valueObjects/room-type/RoomTypePrice";

interface IRoomTypeProps {
    name: RoomTypeName
    price: RoomTypePrice
}

export class RoomType extends AggregateRoot<IRoomTypeProps> {

    get roomTypeId(): RoomTypeId {
        return RoomTypeId.create(this._id).getValue();
    }

    get name(): RoomTypeName {
        return this.props.name;
    }

    get price(): RoomTypePrice {
        return this.props.price;
    }

    public static create(props: IRoomTypeProps, id?: UniqueEntityId): Result<RoomType> {
        const roomType = new RoomType({ ...props }, id)

        const isNew = !!id === false
        if (isNew)
            roomType.addDomainEvent(new RoomTypeCreated(roomType))
        return Result.OK<RoomType>(roomType);
    }
}
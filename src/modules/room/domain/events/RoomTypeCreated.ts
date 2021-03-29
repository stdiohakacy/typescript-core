import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";
import { RoomType } from "../aggregateRoots/RoomType";

export class RoomTypeCreated implements IDomainEvent {
    public dateTimeOccurred: Date;
    public roomType: RoomType;

    constructor(roomType: RoomType) {
        this.dateTimeOccurred = new Date();
        this.roomType = roomType;
    }

    getAggregateId(): UniqueEntityId {
        return this.roomType.id;
    }
}
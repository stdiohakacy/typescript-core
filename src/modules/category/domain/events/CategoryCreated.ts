import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";
import { Category } from "../aggregateRoots/Category";

export class CategoryCreated implements IDomainEvent {
    public dateTimeOccurred: Date;
    public roomType: Category;

    constructor(roomType: Category) {
        this.dateTimeOccurred = new Date();
        this.roomType = roomType;
    }

    getAggregateId(): UniqueEntityId {
        return this.roomType.id;
    }
}
import { Product } from './../aggregateRoots/Product';
import { IDomainEvent } from "../../../../shared/domain/events/IDomainEvent";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";

export class ProductCreated implements IDomainEvent {
    public dateTimeOccurred: Date;
    public product: Product;

    constructor(product: Product) {
        this.dateTimeOccurred = new Date();
        this.product = product;
    }

    getAggregateId(): UniqueEntityId {
        return this.product.id;
    }
}
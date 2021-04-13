import { Result } from "../../../../shared/core/Result";
import { Entity } from "../../../../shared/domain/Entity";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";

export class ProductId extends Entity<any> {
    get id(): UniqueEntityId {
        return this._id;
    }

    private constructor(id?: UniqueEntityId) {
        super(null, id)
    }

    public static create(id?: UniqueEntityId): Result<ProductId> {
        return Result.OK<ProductId>(new ProductId(id));
    }
}
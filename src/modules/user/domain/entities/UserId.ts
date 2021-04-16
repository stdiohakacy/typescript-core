import * as validator from 'class-validator'
import { Result } from "../../../../shared/core/Result";
import { Entity } from "../../../../shared/domain/Entity";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";


export class UserId extends Entity<any> {

    get id(): UniqueEntityId {
        return this._id;
    }

    private constructor(id?: UniqueEntityId) {
        super(null, id)
    }

    public static create(id?: UniqueEntityId): Result<UserId> {
        return Result.OK<UserId>(new UserId(id));
    }
}
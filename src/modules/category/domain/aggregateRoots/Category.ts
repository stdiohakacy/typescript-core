import { CategoryCreated } from './../events/CategoryCreated';
import { Result } from "../../../../shared/core/Result";
import { AggregateRoot } from "../../../../shared/domain/AggregateRoot";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";
import { CategoryId } from "../entities/CategoryId";
import { CategoryName } from "../valueObjects/CategoryName";

interface ICategoryProps {
    name: CategoryName
}

export class Category extends AggregateRoot<ICategoryProps> {
    get categoryId(): CategoryId {
        return CategoryId.create(this._id).getValue();
    }

    get name(): CategoryName {
        return this.props.name;
    }

    public static create(props: ICategoryProps, id?: UniqueEntityId): Result<Category> {
        const roomType = new Category({ ...props }, id)

        const isNew = !!id === false
        if (isNew)
            roomType.addDomainEvent(new CategoryCreated(roomType))
        return Result.OK<Category>(roomType);
    }
}
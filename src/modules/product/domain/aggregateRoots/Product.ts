import { ProductCreated } from './../events/ProductCreated';
import { Result } from "../../../../shared/core/Result";
import { AggregateRoot } from "../../../../shared/domain/AggregateRoot";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";
import { ProductName } from '../valueObjects/ProductName';
import { ProductId } from '../entities/ProductId';
import { CategoryId } from '../../../category/domain/entities/CategoryId';

interface IProductProps {
    name: ProductName
    price: number
}

export class Product extends AggregateRoot<IProductProps> {
    
    get productId(): ProductId {
        return ProductId.create(this._id).getValue();
    }

    get name(): ProductName {
        return this.props.name;
    }

    public static create(props: IProductProps, id?: UniqueEntityId): Result<Product> {
        const product = new Product({ ...props }, id)

        const isNew = !!id === false
        if (isNew)
            product.addDomainEvent(new ProductCreated(product))
        return Result.OK<Product>(product);
    }
}
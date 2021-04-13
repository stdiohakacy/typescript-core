import { Product } from './../../../../../modules/product/domain/aggregateRoots/Product';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IEntity } from "../../../../domain/base/IEntity";
import { BaseEntityDb } from "./BaseEntityDb";
import { CategoryDb } from "./CategoryDb";
import { ProductName } from '../../../../../modules/product/domain/valueObjects/ProductName';
import { UniqueEntityId } from '../../../../domain/UniqueEntityId';

@Entity('product')
export class ProductDb extends BaseEntityDb<Product> {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'name', type: 'varchar' })
    name: string;

    @Column({ name: 'price', type: 'integer' })
    price: number;

    @ManyToOne(() => CategoryDb, category => category.products)
    @JoinColumn({ name: 'category_id' })
    category: CategoryDb;

    @Column({ name: 'category_id', type: 'uuid' })
    categoryId: string;

    toEntity(): Product {
        const productNameOrError = ProductName.create({ value: this.name })
        const productOrError = Product.create({ 
            name: productNameOrError.getValue(), 
            price: this.price, 
            categoryId: this.id 
        }, new UniqueEntityId(this.id))

        if (productOrError.isFailure)
            console.log(productOrError.error)
        return productOrError.isSuccess ? productOrError.getValue() : null
    }

    fromEntity(product: Product): ProductDb {
        this.name = product.name.value
        this.price = product.price
        this.categoryId = product.categoryId
        return this
    }
}

import { Product } from './../../../../../modules/product/domain/aggregateRoots/Product';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IEntity } from "../../../../domain/base/IEntity";
import { BaseEntityDb } from "./BaseEntityDb";
import { CategoryDb } from "./CategoryDb";

@Entity('product')
export class ProductDb extends BaseEntityDb<Product> {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'name', type: 'varchar' })
    name: string;

    @Column({ name: 'price', type: 'integer' })
    price: number;

    @ManyToOne(() => CategoryDb, category => category.products)
    @JoinColumn({ name: 'product_id' })
    category: CategoryDb;

    @Column({ name: 'product_id', type: 'uuid' })
    categoryId: string;

    toEntity(): Product {
        throw new Error('Method not implemented.');
    }
    fromEntity(entity: Product): IEntity {
        throw new Error('Method not implemented.');
    }
}

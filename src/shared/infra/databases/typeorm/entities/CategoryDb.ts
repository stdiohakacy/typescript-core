import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../../../../../modules/category/domain/aggregateRoots/Category";
import { CategoryName } from "../../../../../modules/category/domain/valueObjects/CategoryName";
import { BaseEntityDb } from "./BaseEntityDb";
import { ProductDb } from "./ProductDb";

@Entity('category')
export class CategoryDb extends BaseEntityDb<Category> {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'name', type: 'varchar', length: 150 })
    name: string;

    @OneToMany(() => ProductDb, products => products.category)
    products?: ProductDb[]

    toEntity(): Category {
        const name = CategoryName.create({ value: this.name }).getValue()
        return Category.create({ name }).getValue()
    }

    fromEntity(category: Category): CategoryDb {
        this.name = category.name.value
        return this
    }
}

import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Category } from "../../../../../modules/category/domain/aggregateRoots/Category";
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
        throw new Error("Method not implemented.");
    }
    fromEntity(category: Category): CategoryDb {
        this.name = category.name.value
        return this
    }
}

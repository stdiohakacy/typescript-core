import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CustomerType } from "../../../../../modules/test/CustomerType";
import { IEntity } from "../../../../domain/base/IEntity";
import { BaseEntityDb } from "./BaseEntityDb";
import { CustomerDb } from "./CustomerDb";

@Entity('customer_type')
export class CustomerTypeDb extends BaseEntityDb<CustomerType> {
    toEntity(): CustomerType {
        throw new Error("Method not implemented.");
    }
    fromEntity(entity: CustomerType): IEntity {
        throw new Error("Method not implemented.");
    }
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'name', length: 150 })
    name: string;

    @Column({ name: 'description', length: 150 })
    description: string;

    @OneToMany(() => CustomerDb, customers => customers.customerType)
    customers?: CustomerDb[]
}

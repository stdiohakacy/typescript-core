import { CustomerTypeDb } from './CustomerTypeDb';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntityDb } from "./BaseEntityDb";
import { RentReceiptDetailDb } from './RentReceiptDetailDb';
import { Customer } from '../../../../../modules/test/Customer';
import { IEntity } from '../../../../domain/base/IEntity';

@Entity('customer')
export class CustomerDb extends BaseEntityDb<Customer> {
    toEntity(): Customer {
        throw new Error('Method not implemented.');
    }
    fromEntity(entity: Customer): IEntity {
        throw new Error('Method not implemented.');
    }
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'name', length: 150 })
    name: string;

    @Column({ name: 'code', length: 13 })
    code: string;

    @Column({ name: 'address', length: 150 })
    address: string;

    @ManyToOne(() => CustomerTypeDb, customerType => customerType.customers)
    @JoinColumn({ name: 'customer_type_id' })
    customerType: CustomerTypeDb;
    
    @Column({ name: 'customer_type_id', type: 'uuid' })
    customerTypeId: string;

    @OneToMany(() => RentReceiptDetailDb, rentReceiptDetails => rentReceiptDetails.customer)
    rentReceiptDetails?: RentReceiptDetailDb[]
}

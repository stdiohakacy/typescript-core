import { OrderDetailDb } from './OrderDetailDb';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntityDb } from "./BaseEntityDb";
import { Order } from '../../../../../modules/test/Order';
import { IEntity } from '../../../../domain/base/IEntity';

@Entity('order')
export class OrderDb extends BaseEntityDb<Order>{
    toEntity(): Order {
        throw new Error('Method not implemented.');
    }
    fromEntity(entity: Order): IEntity {
        throw new Error('Method not implemented.');
    }
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'customer_name' })
    customerName: string

    @Column({ name: 'total', type: 'integer' })
    total: number

    @OneToMany(() => OrderDetailDb, orderDetails => orderDetails.order)
    orderDetails?: OrderDetailDb[]
}

import { OrderDetail } from './../../../../../modules/test/OrderDetail';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntityDb } from "./BaseEntityDb";
import { RentReceiptDb } from './RentReceiptDb';
import { OrderDb } from './OrderDb';
import { IEntity } from '../../../../domain/base/IEntity';

@Entity('order_detail')
export class OrderDetailDb extends BaseEntityDb<OrderDetail> {
    toEntity(): OrderDetail {
        throw new Error('Method not implemented.');
    }
    fromEntity(entity: OrderDetail): IEntity {
        throw new Error('Method not implemented.');
    }
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'num_of_day', type: 'integer' })
    numOfDay: number

    @Column({ name: 'price', type: 'integer' })
    price: number

    @Column({ name: 'total', type: 'integer' })
    total: number

    @ManyToOne(() => RentReceiptDb, rentReceipt => rentReceipt.orderDetails)
    @JoinColumn({ name: 'rent_receipt_id' })
    rentReceipt: RentReceiptDb;
    
    @Column({ name: 'rent_receipt_id', type: 'uuid' })
    rentReceiptId: string;

    @ManyToOne(() => OrderDb, order => order.orderDetails)
    @JoinColumn({ name: 'order_id' })
    order: OrderDb;
    
    @Column({ name: 'order_id', type: 'uuid' })
    orderId: string;
}

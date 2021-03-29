import { RentReceipt } from './../../../../../modules/test/RentReceipt';
import { OrderDetailDb } from './OrderDetailDb';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntityDb } from "./BaseEntityDb";
import { RentReceiptDetailDb } from "./RentReceiptDetailDb";
import { RoomDb } from "./RoomDb";
import { IEntity } from '../../../../domain/base/IEntity';

@Entity('rent_receipt')
export class RentReceiptDb extends BaseEntityDb<RentReceipt>{
    toEntity(): RentReceipt {
        throw new Error('Method not implemented.');
    }
    fromEntity(entity: RentReceipt): IEntity {
        throw new Error('Method not implemented.');
    }
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id: string;

    @Column({ name: 'start_time', nullable: true, type: 'timestamp without time zone' })
    startTime: Date

    @ManyToOne(() => RoomDb, room => room.rentReceipts)
    @JoinColumn({ name: 'room_id' })
    room: RoomDb;
    
    @Column({ name: 'room_id', type: 'uuid' })
    roomId: string;

    @OneToMany(() => RentReceiptDetailDb, rentReceiptDetails => rentReceiptDetails.rentReceipt)
    rentReceiptDetails?: RentReceiptDetailDb[]

    @OneToMany(() => OrderDetailDb, orderDetails => orderDetails.rentReceipt)
    orderDetails?: OrderDetailDb[]
}

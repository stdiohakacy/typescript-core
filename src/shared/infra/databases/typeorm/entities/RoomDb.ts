import { SaleReportDetailDb } from './SaleReportDetailDb';
import { RoomTypeDb } from './RoomTypeDb';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntityDb } from "./BaseEntityDb";
import { RentReceiptDb } from './RentReceiptDb';
import { ReportFrequencyDetailDb } from './ReportFrequencyDetailDb';
import { Room } from '../../../../../modules/test/Room';
import { IEntity } from '../../../../domain/base/IEntity';

@Entity('room')
export class RoomDb extends BaseEntityDb<Room>{
    toEntity(): Room {
        throw new Error('Method not implemented.');
    }
    fromEntity(entity: Room): IEntity {
        throw new Error('Method not implemented.');
    }
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'name', length: 150 })
    name: string;

    @Column({ name: 'status', type: 'boolean' })
    status: boolean;

    @Column({ name: 'description', type: 'text' })
    description: string;

    @ManyToOne(() => RoomTypeDb, roomType => roomType.rooms)
    @JoinColumn({ name: 'room_type_id' })
    roomType: RoomTypeDb;

    @Column({ name: 'room_type_id', type: 'uuid' })
    roomTypeId: string;

    @OneToMany(() => RentReceiptDb, rentReceipts => rentReceipts.room)
    rentReceipts?: RentReceiptDb[]

    @OneToMany(() => ReportFrequencyDetailDb, reportFrequencyDetails => reportFrequencyDetails.room)
    reportFrequencyDetails?: ReportFrequencyDetailDb[]
}

import { ReportFrequencyDetail } from './../../../../../modules/test/ReportFrequencyDetail';
import { ReportFrequencyDb } from './ReportFrequencyDb';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntityDb } from "./BaseEntityDb";
import { RoomDb } from './RoomDb';
import { IEntity } from '../../../../domain/base/IEntity';

@Entity('report_frequency_detail')
export class ReportFrequencyDetailDb extends BaseEntityDb<ReportFrequencyDetail> {
    toEntity(): ReportFrequencyDetail {
        throw new Error('Method not implemented.');
    }
    fromEntity(entity: ReportFrequencyDetail): IEntity {
        throw new Error('Method not implemented.');
    }
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id: string;
    
    @Column({ name: 'days_of_rent', type: 'integer' })
    daysOfRent: number;

    @Column({ name: 'frequency', type: 'integer' })
    frequency: number;

    @ManyToOne(() => ReportFrequencyDb, reportFrequency => reportFrequency.reportFrequencyDetails)
    @JoinColumn({ name: 'report_frequency_id' })
    reportFrequency: ReportFrequencyDb;
    
    @Column({ name: 'report_frequency_id', type: 'uuid' })
    reportFrequencyId: string;

    @ManyToOne(() => RoomDb, room => room.reportFrequencyDetails)
    @JoinColumn({ name: 'room_id' })
    room: RoomDb;
    
    @Column({ name: 'room_id', type: 'uuid' })
    roomId: string;
}

import { ReportFrequency } from './../../../../../modules/test/ReportFrequency';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntityDb } from "./BaseEntityDb";
import { ReportFrequencyDetailDb } from "./ReportFrequencyDetailDb";
import { IEntity } from '../../../../domain/base/IEntity';

@Entity('report_frequency')
export class ReportFrequencyDb extends BaseEntityDb<ReportFrequency> {
    toEntity(): ReportFrequency {
        throw new Error('Method not implemented.');
    }
    fromEntity(entity: ReportFrequency): IEntity {
        throw new Error('Method not implemented.');
    }
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id: string;
    
    @Column({ name: 'monthly', type: 'integer' })
    monthly: number;

    @Column({ name: 'day_total', type: 'integer' })
    dayTotal: number;

    @OneToMany(() => ReportFrequencyDetailDb, reportFrequencyDetails => reportFrequencyDetails.reportFrequency)
    reportFrequencyDetails?: ReportFrequencyDetailDb[]
}

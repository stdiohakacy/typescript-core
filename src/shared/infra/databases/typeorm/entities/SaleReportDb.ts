import { SaleReport } from './../../../../../modules/test/SaleReport';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntityDb } from "./BaseEntityDb";
import { SaleReportDetailDb } from "./SaleReportDetailDb";
import { IEntity } from '../../../../domain/base/IEntity';

@Entity('sale_report')
export class SaleReportDb extends BaseEntityDb<SaleReport> {
    toEntity(): SaleReport {
        throw new Error('Method not implemented.');
    }
    fromEntity(entity: SaleReport): IEntity {
        throw new Error('Method not implemented.');
    }
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id: string;

    @Column({ name: 'monthly', type: 'integer' })
    monthly: string;

    @Column({ name: 'total', type: 'integer' })
    total: number;

    @OneToMany(() => SaleReportDetailDb, saleReportDetails => saleReportDetails.saleReport)
    saleReportDetails?: SaleReportDetailDb[]
}

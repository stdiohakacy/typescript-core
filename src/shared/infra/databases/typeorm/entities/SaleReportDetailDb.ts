import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SaleReportDetail } from "../../../../../modules/test/SaleReportDetail";
import { IEntity } from "../../../../domain/base/IEntity";
import { BaseEntityDb } from "./BaseEntityDb";
import { RoomTypeDb } from "./RoomTypeDb";
import { SaleReportDb } from "./SaleReportDb";

@Entity('sale_report_detail')
export class SaleReportDetailDb extends BaseEntityDb<SaleReportDetail> {
    toEntity(): SaleReportDetail {
        throw new Error("Method not implemented.");
    }
    fromEntity(entity: SaleReportDetail): IEntity {
        throw new Error("Method not implemented.");
    }
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id: string;

    @Column({ name: 'revenue', type: 'integer' })
    revenue: number;

    @Column({ name: 'ratio', type: 'integer' })
    ratio: number;

    @ManyToOne(() => RoomTypeDb, roomType => roomType.saleReportDetails)
    @JoinColumn({ name: 'room_type_id' })
    roomType: RoomTypeDb;
    
    @Column({ name: 'room_type_id', type: 'uuid' })
    roomTypeId: string;

    @ManyToOne(() => SaleReportDb, saleReport => saleReport.saleReportDetails)
    @JoinColumn({ name: 'sale_report_id' })
    saleReport: SaleReportDb;
    
    @Column({ name: 'sale_report_id', type: 'uuid' })
    saleReportId: string;
}

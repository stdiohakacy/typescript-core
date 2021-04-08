import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SaleReportDetail } from "../../../../../modules/test/SaleReportDetail";
import { IEntity } from "../../../../domain/base/IEntity";
import { BaseEntityDb } from "./BaseEntityDb";
import { CategoryDb } from "./CategoryDb";

@Entity('product')
export class ProductDb extends BaseEntityDb<SaleReportDetail> {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'name', type: 'varchar' })
    name: string;

    @Column({ name: 'price', type: 'integer' })
    price: number;

    @ManyToOne(() => CategoryDb, category => category.products)
    @JoinColumn({ name: 'product_id' })
    category: CategoryDb;

    @Column({ name: 'product_id', type: 'uuid' })
    categoryId: string;

    // @Column({ name: 'room_type_id', type: 'uuid' })
    // roomTypeId: string;

    // @ManyToOne(() => SaleReportDb, saleReport => saleReport.saleReportDetails)
    // @JoinColumn({ name: 'sale_report_id' })
    // saleReport: SaleReportDb;

    // @Column({ name: 'sale_report_id', type: 'uuid' })
    // saleReportId: string;

    // handler
    toEntity(): SaleReportDetail {
        throw new Error("Method not implemented.");
    }
    fromEntity(entity: SaleReportDetail): IEntity {
        throw new Error("Method not implemented.");
    }
}

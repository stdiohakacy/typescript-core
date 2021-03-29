import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { RentReceiptDetail } from "../../../../../modules/test/RentReceiptDetail";
import { IEntity } from "../../../../domain/base/IEntity";
import { BaseEntityDb } from "./BaseEntityDb";
import { CustomerDb } from "./CustomerDb";
import { RentReceiptDb } from "./RentReceiptDb";

@Entity('rent_receipt_detail')
export class RentReceiptDetailDb extends BaseEntityDb<RentReceiptDetail> {
    toEntity(): RentReceiptDetail {
        throw new Error("Method not implemented.");
    }
    fromEntity(entity: RentReceiptDetail): IEntity {
        throw new Error("Method not implemented.");
    }
    @PrimaryGeneratedColumn('uuid', { name: 'id'})
    id: string;

    @ManyToOne(() => RentReceiptDb, rentReceipt => rentReceipt.rentReceiptDetails)
    @JoinColumn({ name: 'rent_receipt_id' })
    rentReceipt: RentReceiptDb;
    
    @Column({ name: 'rent_receipt_id', type: 'uuid' })
    rentReceiptId: string;

    @ManyToOne(() => CustomerDb, customer => customer.rentReceiptDetails)
    @JoinColumn({ name: 'customer_id' })
    customer: CustomerDb;
    
    @Column({ name: 'customer_id', type: 'uuid' })
    customerId: string;
}

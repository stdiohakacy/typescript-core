import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoomType } from "../../../../../modules/room/domain/aggregateRoots/RoomType";
import { BaseEntityDb } from "./BaseEntityDb";
import { RoomDb } from "./RoomDb";
import { SaleReportDetailDb } from "./SaleReportDetailDb";

@Entity('room_type')
export class RoomTypeDb extends BaseEntityDb<RoomType> {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'name', length: 150 })
    name: string;

    @Column({ name: 'price', type: 'integer' })
    price: number;

    @OneToMany(() => RoomDb, rooms => rooms.roomType)
    rooms?: RoomDb[]

    @OneToMany(() => SaleReportDetailDb, saleReportDetails => saleReportDetails.roomType)
    saleReportDetails?: SaleReportDetailDb[]

    /* handlers */

    toEntity(): RoomType {
        throw new Error("Method not implemented.");
    }

    fromEntity(roomType: RoomType): RoomTypeDb {
        this.name = roomType.name.value
        this.price = roomType.price.value
        return this
    }
}

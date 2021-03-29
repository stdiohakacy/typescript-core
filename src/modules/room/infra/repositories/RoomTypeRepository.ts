import { Service } from 'typedi';
import { RoomTypeDb } from "../../../../shared/infra/databases/typeorm/entities/RoomTypeDb";
import { BaseRepository } from '../../../../shared/infra/repositories/BaseRepository';
import { RoomType } from '../../domain/aggregateRoots/RoomType';
import { IRoomTypeRepository } from "../adapter/IRoomTypeRepository";

@Service('room_type.repository')
export class RoomTypeRepository extends BaseRepository<RoomType, RoomTypeDb, string> implements IRoomTypeRepository {
    constructor() {
        super(RoomTypeDb, {
            TABLE_NAME: 'room_type'
        })
    }

    async isNameExist(name: string): Promise<boolean> {
        let query = this.repository
            .createQueryBuilder('category')
            .where(`LOWER(category.name) = LOWER(:name)`, { name });

        return !!await query.getOne();
    }
}

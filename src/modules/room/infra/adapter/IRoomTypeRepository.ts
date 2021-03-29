import { IBaseRepository } from "../../../../shared/infra/repositories/IBaseRepository";
import { RoomType } from "../../domain/aggregateRoots/RoomType";

export interface IRoomTypeRepository extends IBaseRepository<RoomType, string> {
    isNameExist(name: string): Promise<boolean>
}
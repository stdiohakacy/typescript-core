import { Channel } from './../../domain/aggregateRoots/Channel';
import { IBaseRepository } from "../../../../shared/infra/repositories/IBaseRepository";

export interface IChannelRepository extends IBaseRepository<Channel, string> {
    isNameExist(name: string): Promise<boolean>
    getSingleChannel(fromUser: string, toUser: string): Promise<Channel>
}
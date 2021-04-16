import { IBaseRepository } from "../../../../shared/infra/repositories/IBaseRepository";
import { ChannelUser } from '../../domain/entities/ChannelUser';

export interface IChannelUserRepository extends IBaseRepository<ChannelUser, string> {
}
import { Service } from 'typedi';
import { BaseRepository } from '../../../../shared/infra/repositories/BaseRepository';
import { ChannelUser } from '../../domain/entities/ChannelUser';
import { ChannelUserDb } from '../../../../shared/infra/databases/typeorm/entities/ChannelUserDb';
import { IChannelUserRepository } from '../adapter/IChannelUserRepository';

@Service('channel_user.repository')
export class ChannelUserRepository extends BaseRepository<ChannelUser, ChannelUserDb, string> implements IChannelUserRepository {
    constructor() {
        super(ChannelUserDb, {
            TABLE_NAME: 'channel_user'
        })
    }
}

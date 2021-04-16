import { ChannelDb } from './../../../../shared/infra/databases/typeorm/entities/ChannelDb';
import { Service } from 'typedi';
import { BaseRepository } from '../../../../shared/infra/repositories/BaseRepository';
import { Channel } from '../../domain/aggregateRoots/Channel';
import { IChannelRepository } from '../adapter/IChannelRepository';

@Service('channel.repository')
export class ChannelRepository extends BaseRepository<Channel, ChannelDb, string> implements IChannelRepository {
    constructor() {
        super(ChannelDb, {
            TABLE_NAME: 'channel'
        })
    }

    async isNameExist(name: string): Promise<boolean> {
        let query = this.repository
            .createQueryBuilder('channel')
            .where(`LOWER(channel.name) = LOWER(:name)`, { name });

        return !!await query.getOne();
    }
}

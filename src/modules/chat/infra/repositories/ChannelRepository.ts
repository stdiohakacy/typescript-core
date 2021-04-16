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
        let query = await this.repository
            .createQueryBuilder('channel')
            .where(`LOWER(channel.name) = LOWER(:name)`, { name });

        return !!query.getOne();
    }

    async getSingleChannel(fromUser: string, toUser: string): Promise<Channel> {
        let query = await this.repository
            .createQueryBuilder('channel')
            .leftJoinAndSelect("channel.channelUsers", "channelUsers")
            .where("channelUsers.userId IN (:...userIds)", { userIds: [fromUser, toUser] })
            .groupBy('channel.id')
            .select('channel.id')
            .addSelect('channel.name')
            .addSelect('channel.description')
            .addSelect('channel.isDirect')
            .addSelect('channel.lastSeen')
            .addSelect('channel.lastMessageId')
            .addSelect('channel.lastMessageCreatedAt')
            .having('COUNT(DISTINCT(channelUsers.id)) = 2')
            .getOne()

        return query ? query.toEntity() : null;
    }
}

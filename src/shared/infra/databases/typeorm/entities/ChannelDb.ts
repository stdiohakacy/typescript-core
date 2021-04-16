import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Channel } from '../../../../../modules/chat/domain/aggregateRoots/Channel';
import { ChannelName } from '../../../../../modules/chat/domain/valueObjects/channel/ChannelName';
import { UniqueEntityId } from '../../../../domain/UniqueEntityId';
import { BaseEntityDb } from './BaseEntityDb';
import { ChannelUserDb } from './ChannelUserDb';

@Entity('channel')
export class ChannelDb extends BaseEntityDb<Channel> {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'name', type: 'varchar', nullable: true })
    name?: string;

    @Column({ name: 'description', type: 'varchar', nullable: true })
    description?: string;

    @Column({ name: 'is_direct', type: 'boolean', default: false })
    isDirect: boolean;

    @Column({ name: 'is_private', type: 'boolean', default: true })
    isPrivate: boolean;

    @Column({
        name: 'last_seen',
        type: 'simple-json',
        default: {},
    })
    lastSeen: Record<string, any>;

    @Column({ name: 'last_message_id', type: 'uuid', nullable: true })
    lastMessageId?: string;

    @Column({
        name: 'last_message_created_at',
        type: 'timestamp without time zone',
        default: () => 'CURRENT_TIMESTAMP',
        nullable: true,
    })
    lastMessageCreatedAt?: Date;

    /* Relationship */
    @OneToMany(() => ChannelUserDb, channelUsers => channelUsers.channel)
    channelUsers: ChannelUserDb[];

    /** handlers */
    toEntity(): Channel {
        const { name, description, isDirect, isPrivate, lastSeen, lastMessageId, lastMessageCreatedAt } = this

        const channelOrError = Channel.create({
            name: name
                ? ChannelName.create({ value: name }).getValue()
                : null,
            description,
            isDirect,
            isPrivate,
            lastSeen,
            lastMessageId,
            lastMessageCreatedAt
        }, new UniqueEntityId(this.id))
        return channelOrError.isSuccess ? channelOrError.getValue() : null
    }

    fromEntity(channel: Channel): ChannelDb {
        if (channel.name)
            this.name = channel.name.value
        if (channel.description)
            this.description = channel.description
        return this
    }
}

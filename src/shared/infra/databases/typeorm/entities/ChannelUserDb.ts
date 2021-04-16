import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Channel } from '../../../../../modules/chat/domain/aggregateRoots/Channel';
import { ChannelUser } from '../../../../../modules/chat/domain/entities/ChannelUser';
import { BaseEntityDb } from './BaseEntityDb';
import { ChannelDb } from './ChannelDb';
import { UserDb } from './UserDb';

@Entity('channel_user')
export class ChannelUserDb extends BaseEntityDb<ChannelUser> {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'channel_id', type: 'uuid' })
    channelId: string;

    @Column({ name: 'user_id', type: 'uuid' })
    userId: string;

    @Column({ name: 'is_mute', type: 'boolean', default: false })
    isMute: boolean;

    /** relationships */
    @ManyToOne(() => ChannelDb, channel => channel.channelUsers)
    @JoinColumn({ name: 'channel_id' })
    channel: ChannelDb;

    @ManyToOne(() => UserDb, user => user.channelUsers)
    @JoinColumn({ name: 'user_id' })
    user: UserDb;

    /** handlers */
    toEntity(): ChannelUser {
        throw new Error("Method not implemented.");
    }

    fromEntity(channelUser: ChannelUser): ChannelUserDb {
        this.userId = channelUser.userId.id.toString()
        this.channelId = channelUser.channelId.id.toString()
        return this
    }
}

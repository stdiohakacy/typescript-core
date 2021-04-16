import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Message } from '../../../../../modules/chat/domain/entities/Message';
import { MessageStatus } from '../../../../../modules/chat/domain/enums/MessageStatus';
import { MessageType } from '../../../../../modules/chat/domain/enums/MessageType';
import { BaseEntityDb } from './BaseEntityDb';
import { ChannelDb } from './ChannelDb';
import { UserDb } from './UserDb';

@Entity('message')
export class MessageDb extends BaseEntityDb<Message> {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column({ name: 'user_id', type: 'uuid', nullable: true })
    userId: string;

    @Column({ name: 'channel_id', type: 'uuid' })
    channelId: string;

    @Column({ name: 'parent_message_id', type: 'uuid', nullable: true })
    parentMessageId: string;

    @Column({ name: 'content', type: 'varchar', nullable: true })
    content: string;

    @Column({
        name: 'type',
        type: 'enum',
        enum: MessageType,
        default: MessageType.CHAT,
    })
    type: MessageType;

    @Column({
        name: 'status',
        type: 'enum',
        enum: MessageStatus,
        default: MessageStatus.SENT,
    })
    status: MessageStatus;

    @Column({
        name: 'system_message',
        type: 'simple-json',
        nullable: true,
    })
    systemMessage: { [key: string]: any };

    @Column({ name: 'is_pin', type: 'boolean', default: false })
    isPin: boolean;

    @Column({ name: 'is_star', type: 'boolean', default: false })
    isStar: boolean;

    /** Relationships */
    @ManyToOne(() => UserDb, user => user.messages)
    @JoinColumn({ name: 'user_id' })
    user: UserDb;

    @ManyToOne(() => ChannelDb, channel => channel.messages)
    @JoinColumn({ name: 'channel_id' })
    channel: ChannelDb;

    /** Handlers */
    toEntity(): Message {
        return null
    }

    fromEntity(message: Message): MessageDb {
        if (message.userId)
            this.userId = message.userId.id.toString()
        if (message.channelId)
            this.channelId = message.channelId.id.toString()
        if (message.parentMessageId)
            this.parentMessageId = message.parentMessageId
        if (message.content)
            this.content = message.content
        if (message.type)
            this.type = message.type
        if (message.status)
            this.status = message.status
        if (message.isPin)
            this.isPin = message.isPin
        if (message.isStar)
            this.isStar = message.isStar
        return this
    }
}

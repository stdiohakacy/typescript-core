import * as validator from 'class-validator'
import { Result } from "../../../../shared/core/Result";
import { Entity } from "../../../../shared/domain/Entity";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";
import { UserId } from "../../../user/domain/entities/UserId";
import { MessageStatus } from '../enums/MessageStatus';
import { MessageType } from '../enums/MessageType';
import { ChannelId } from "./ChannelId";

interface IMessageProps {
    userId: UserId;
    channelId: ChannelId;
    parentMessageId?: string;
    content: string;
    type?: MessageType;
    status?: MessageStatus;
    systemMessage?: { [key: string]: any };
    isPin?: boolean;
    isStar?: boolean;
}

export class Message extends Entity<IMessageProps> {
    private constructor(props: IMessageProps, id?: UniqueEntityId) {
        super(props, id);
    }

    get id(): UniqueEntityId {
        return this._id;
    }

    get userId(): UserId {
        return this.props.userId
    }

    get channelId(): ChannelId {
        return this.props.channelId
    }

    get parentMessageId(): string {
        return this.props.parentMessageId
    }

    get content(): string {
        return this.props.content
    }

    get type(): MessageType {
        return this.props.type
    }

    get status(): MessageStatus {
        return this.props.status
    }

    get systemMessage(): { [key: string]: any } {
        return this.props.systemMessage
    }

    get isPin(): boolean {
        return this.props.isPin
    }

    get isStar(): boolean {
        return this.props.isStar
    }

    public static create(props: IMessageProps, id?: UniqueEntityId): Result<Message> {
        if (!props.userId)
            return Result.fail('The user id is required!')
        if (!props.channelId)
            return Result.fail('The channel id is required!')
        if (!validator.isUUID(props.userId.id.toString()))
            return Result.fail('The user id is invalid!')
        if (!validator.isUUID(props.channelId.id.toString()))
            return Result.fail('The channel id is invalid!')
        if (!props.content)
            return Result.fail('The content is required!')
        return Result.OK(new Message(props, id))
    }
}
import { ChannelName } from './../valueObjects/channel/ChannelName';
import { Result } from "../../../../shared/core/Result";
import { AggregateRoot } from "../../../../shared/domain/AggregateRoot";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";
import { ChannelId } from "../entities/ChannelId";

interface IChannelProps {
    name?: ChannelName;
    description?: string;
    isDirect?: boolean;
    isPrivate?: boolean;
    lastSeen?: Record<string, any>;
    lastMessageId?: string;
    lastMessageCreatedAt?: Date;
}

export class Channel extends AggregateRoot<IChannelProps> {
    get channelId(): ChannelId {
        return ChannelId.create(this._id).getValue();
    }

    get name(): ChannelName {
        return this.props.name
    }

    get description(): string {
        return this.props.description
    }
    
    get isDirect(): boolean {
        return this.props.isDirect
    }

    get isPrivate(): boolean {
        return this.props.isPrivate
    }

    get lastMessageId(): string {
        return this.props.lastMessageId
    }

    get lastMessageCreatedAt(): Date {
        return this.props.lastMessageCreatedAt
    }

    public static create(props: IChannelProps, id?: UniqueEntityId): Result<Channel> {
        const channel = new Channel({ ...props }, id)
        return Result.OK(channel)
    }
}
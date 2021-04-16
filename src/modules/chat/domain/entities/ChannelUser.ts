import * as validator from 'class-validator'
import { Result } from "../../../../shared/core/Result";
import { Entity } from "../../../../shared/domain/Entity";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";
import { UserId } from "../../../user/domain/entities/UserId";
import { ChannelId } from "./ChannelId";

interface IChannelUserProps {
    channelId: ChannelId;
    userId: UserId;
    isMute?: boolean;
}

export class ChannelUser extends Entity<IChannelUserProps> {
    private constructor(props: IChannelUserProps, id?: UniqueEntityId) {
        super(props, id);
    }

    get id(): UniqueEntityId {
        return this._id;
    }

    get channelId(): ChannelId {
        return this.props.channelId;
    }

    get userId(): UserId {
        return this.props.userId;
    }

    get isMute(): boolean {
        return this.props.isMute;
    }

    public static create(props: IChannelUserProps, id?: UniqueEntityId): Result<ChannelUser> {
        if (!props.channelId)
            return Result.fail('The channel id is required!')
        if (!validator.isUUID(props.channelId.id.toString()))
            return Result.fail('The channel id is invalid!')
        if (!props.userId)
            return Result.fail('The user id is required!')
        if (!validator.isUUID(props.userId.id.toString()))
            return Result.fail('The user id is invalid!')

        return Result.OK(new ChannelUser(props, id))
    }
}
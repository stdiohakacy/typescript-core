import { Result } from "../../../../../shared/core/Result";
import { ValueObject } from "../../../../../shared/domain/ValueObject";
import * as validator from 'class-validator'

interface IChannelNameProps {
    value: string;
}

export class ChannelName extends ValueObject<IChannelNameProps> {
    private constructor(props: IChannelNameProps) {
        super(props);
    }

    get value(): string {
        return this.props.value;
    }

    public static create(props: IChannelNameProps): Result<ChannelName> {
        if (validator.isEmpty(props.value))
            return Result.fail<ChannelName>(`The channel name is null or empty`)
        if (props.value.length < 3 || props.value.length > 10)
            return Result.fail<ChannelName>(`The length of channel name is between 3 and 10`)

        return Result.OK<ChannelName>(new ChannelName(props))
    }
}
import { Result } from "../../../../../shared/core/Result";
import { ValueObject } from "../../../../../shared/domain/ValueObject";
import * as validator from 'class-validator'

interface IRoomTypeNameProps {
    value: string;
}

export class RoomTypeName extends ValueObject<IRoomTypeNameProps> {
    private constructor(props: IRoomTypeNameProps) {
        super(props);
    }

    get value(): string {
        return this.props.value;
    }

    public static create(props: IRoomTypeNameProps): Result<RoomTypeName> {
        if (validator.isEmpty(props.value))
            return Result.fail<RoomTypeName>(`The room type name is null or empty`)
        
        if(props.value.length < 3 || props.value.length > 10)
            return Result.fail<RoomTypeName>(`The length of room type name is between 3 and 10`)
        
        return Result.OK<RoomTypeName>(new RoomTypeName(props))
    }
}
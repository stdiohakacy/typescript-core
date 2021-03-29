import { Result } from "../../../../../shared/core/Result";
import { ValueObject } from "../../../../../shared/domain/ValueObject";
import * as validator from 'class-validator'

interface IRoomTypePriceProps {
    value: number;
}

export class RoomTypePrice extends ValueObject<IRoomTypePriceProps> {
    private constructor(props: IRoomTypePriceProps) {
        super(props);
    }

    get value(): number {
        return this.props.value;
    }

    public static create(props: IRoomTypePriceProps): Result<RoomTypePrice> {
        if (validator.isEmpty(props.value))
            return Result.fail<RoomTypePrice>(`The room type price is null or empty`)
        
        if(props.value < 0 || props.value > 500000)
            return Result.fail<RoomTypePrice>(`The length of room type name is between 0 and 500.000`)
        
        return Result.OK<RoomTypePrice>(new RoomTypePrice(props))
    }
}
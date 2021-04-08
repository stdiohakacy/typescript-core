import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";
import * as validator from 'class-validator'

interface ICategoryName {
    value: string;
}

export class CategoryName extends ValueObject<ICategoryName> {
    private constructor(props: ICategoryName) {
        super(props);
    }

    get value(): string {
        return this.props.value;
    }

    public static create(props: ICategoryName): Result<CategoryName> {
        if (validator.isEmpty(props.value))
            return Result.fail<CategoryName>(`The category name is null or empty`)

        if (props.value.length < 10 || props.value.length > 150)
            return Result.fail<CategoryName>(`The length of room type name is between 10 and 150`)

        return Result.OK<CategoryName>(new CategoryName(props))
    }
}
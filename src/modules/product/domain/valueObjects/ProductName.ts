import { Result } from "../../../../shared/core/Result";
import { ValueObject } from "../../../../shared/domain/ValueObject";
import * as validator from 'class-validator'

interface IProductName {
    value: string;
}

export class ProductName extends ValueObject<IProductName> {
    private constructor(props: IProductName) {
        super(props);
    }

    get value(): string {
        return this.props.value;
    }

    public static create(props: IProductName): Result<ProductName> {
        if (validator.isEmpty(props.value))
            return Result.fail<ProductName>(`The product name is null or empty`)

        if (props.value.length < 10 || props.value.length > 150)
            return Result.fail<ProductName>(`The length of product name is between 10 and 150`)

        return Result.OK<ProductName>(new ProductName(props))
    }
}
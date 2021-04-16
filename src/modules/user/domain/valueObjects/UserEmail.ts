import { Result } from './../../../../shared/core/Result';
import { ValueObject } from "../../../../shared/domain/ValueObject";
import * as validator from 'class-validator'

export interface IUserEmailProps {
    value: string;
}

export class UserEmail extends ValueObject<IUserEmailProps> {
    private constructor(props: IUserEmailProps) {
        super(props);
    }

    get value(): string {
        return this.props.value;
    }

    private static format(email: string): string {
        return email.trim().toLowerCase();
    }

    public static create(props: IUserEmailProps): Result<UserEmail> {
        const { value } = props
        if (!validator.isEmail(value))
            return Result.fail('The email address not valid');
        else {
            return Result.OK(new UserEmail({ value: this.format(value) }));
        }
    }
}
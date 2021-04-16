import { Result } from "../../../../../shared/core/Result"
import { UseCaseError } from "../../../../../shared/core/UseCaseError"

export namespace LoginUserErrors {
    export class AccountInvalid extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: `Wrong email or password`
            } as UseCaseError)
        }
    }
}
import { Result } from "../../../../../shared/core/Result"
import { UseCaseError } from "../../../../../shared/core/UseCaseError"

export namespace GetProductByIdErrors {
    export class NotFound extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: `The product was not found!`
            } as UseCaseError)
        }
    }
}
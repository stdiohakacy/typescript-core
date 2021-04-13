import { Result } from "../../../../../shared/core/Result"
import { UseCaseError } from "../../../../../shared/core/UseCaseError"

export namespace GetCategoryByIdErrors {
    export class NotFound extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: `The category was not found!`
            } as UseCaseError)
        }
    }
}
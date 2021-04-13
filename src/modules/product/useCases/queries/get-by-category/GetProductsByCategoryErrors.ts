import { Result } from "../../../../../shared/core/Result"
import { UseCaseError } from "../../../../../shared/core/UseCaseError"

export namespace GetProductsByCategoryErrors {
    export class CategoryNotFound extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: `The category was not found!`
            } as UseCaseError)
        }
    }
}
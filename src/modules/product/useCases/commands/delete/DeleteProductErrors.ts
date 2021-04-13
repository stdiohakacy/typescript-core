import { Result } from "../../../../../shared/core/Result"
import { UseCaseError } from "../../../../../shared/core/UseCaseError"

export namespace DeleteProductErrors {
    export class NotFound extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: `The product was not found!`
            } as UseCaseError)
        }
    }

    export class DataCannotSave extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: `Data cannot save`
            } as UseCaseError)
        }
    }
}
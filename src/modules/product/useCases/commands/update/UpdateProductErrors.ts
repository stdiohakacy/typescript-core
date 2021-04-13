import { Result } from "../../../../../shared/core/Result"
import { UseCaseError } from "../../../../../shared/core/UseCaseError"

export namespace UpdateProductErrors {
    export class NotFound extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: `The product was not found!`
            } as UseCaseError)
        }
    }

    export class CategoryNotFound extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: `The category was not found!`
            } as UseCaseError)
        }
    }

    export class NameAlreadyExist extends Result<UseCaseError> {
        constructor(name: string) {
            super(false, {
                message: `The category name : ${name} already exists`
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
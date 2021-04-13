import { Result } from "../../../../../shared/core/Result"
import { UseCaseError } from "../../../../../shared/core/UseCaseError"

export namespace CreateProductErrors {
    export class NameAlreadyExist extends Result<UseCaseError> {
        constructor(name: string) {
            super(false, {
                message: `The product name : ${name} already exists`
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

    export class CategoryNotFound extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: `The category not found!`
            } as UseCaseError)
        }
    }
}
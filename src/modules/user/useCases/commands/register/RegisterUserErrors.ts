import { Result } from "../../../../../shared/core/Result"
import { UseCaseError } from "../../../../../shared/core/UseCaseError"

export namespace RegisterUserErrors {
    export class EmailAlreadyExist extends Result<UseCaseError> {
        constructor(email: string) {
            super(false, {
                message: `The email : ${email} already exists`
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
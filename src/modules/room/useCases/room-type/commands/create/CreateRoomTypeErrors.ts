import { Result } from "../../../../../../shared/core/Result"
import { UseCaseError } from "../../../../../../shared/core/UseCaseError"

export namespace CreateRoomTypeErrors {
    export class NameAlreadyExist extends Result<UseCaseError> {
        constructor(name: string) {
            super(false, {
                message: `The room type name : ${name} already exists`
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
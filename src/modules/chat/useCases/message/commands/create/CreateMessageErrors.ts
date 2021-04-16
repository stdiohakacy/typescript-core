import { Result } from './../../../../../../shared/core/Result';
import { UseCaseError } from "../../../../../../shared/core/UseCaseError";

export namespace CreateMessageErrors {
    export class ChannelNotFound extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: `Channel not found!`
            } as UseCaseError)
        }
    }

    export class DataCannotSave extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: `Data cannot save!`
            } as UseCaseError)
        }
    }
}
import { Result } from "../../../../../shared/core/Result"
import { UseCaseError } from "../../../../../shared/core/UseCaseError"

export namespace GetSingleChannelErrors {
    export class ToUserNotFound extends Result<UseCaseError> {
        constructor() {
            super(false, {
                message: `To user not found!`
            } as UseCaseError)
        }
    }
}
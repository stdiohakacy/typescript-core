import { ApplicationError } from "../../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../../shared/core/Result";
import { CreateMessageErrors } from "./CreateMessageErrors";

export type CreateMessageResponse = Either<
    CreateMessageErrors.ChannelNotFound |
    CreateMessageErrors.DataCannotSave |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<string>
>

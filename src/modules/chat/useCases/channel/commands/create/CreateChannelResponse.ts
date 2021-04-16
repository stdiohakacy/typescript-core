import { ApplicationError } from "../../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../../shared/core/Result";
import { CreateChannelErrors } from "./CreateChannelErrors";

export type CreateChannelResponse = Either<
    CreateChannelErrors.NameAlreadyExist |
    CreateChannelErrors.DataCannotSave |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<string>
>

import { ApplicationError } from "../../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../../shared/core/Result";
import { CreateRoomTypeErrors } from "./CreateRoomTypeErrors";

export type CreateRoomTypeResponse = Either<
    CreateRoomTypeErrors.NameAlreadyExist |
    CreateRoomTypeErrors.DataCannotSave |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<string>
>

import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../shared/core/Result";
import { CreateCategoryErrors } from "./CreateRoomTypeErrors";

export type CreateCategoryResponse = Either<
    CreateCategoryErrors.NameAlreadyExist |
    CreateCategoryErrors.DataCannotSave |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<string>
>

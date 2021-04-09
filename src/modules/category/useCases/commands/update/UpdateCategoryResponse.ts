import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../shared/core/Result";
import { UpdateCategoryErrors } from "./UpdateCategoryErrors";

export type UpdateCategoryResponse = Either<
    UpdateCategoryErrors.NameAlreadyExist |
    UpdateCategoryErrors.DataCannotSave |
    UpdateCategoryErrors.NotFound |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<boolean>
>

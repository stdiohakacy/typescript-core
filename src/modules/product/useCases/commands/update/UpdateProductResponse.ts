import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../shared/core/Result";
import { UpdateProductErrors } from "./UpdateProductErrors";

export type UpdateProductResponse = Either<
    UpdateProductErrors.NameAlreadyExist |
    UpdateProductErrors.DataCannotSave |
    UpdateProductErrors.NotFound |
    UpdateProductErrors.CategoryNotFound |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<boolean>
>

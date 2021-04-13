import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../shared/core/Result";
import { CreateProductErrors } from "./CreateProductErrors";

export type CreateProductResponse = Either<
    CreateProductErrors.CategoryNotFound |
    CreateProductErrors.DataCannotSave |
    CreateProductErrors.NameAlreadyExist |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<string>
>

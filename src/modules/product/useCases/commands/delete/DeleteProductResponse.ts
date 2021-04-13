import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../shared/core/Result";
import { DeleteProductErrors } from "./DeleteProductErrors";

export type DeleteProductResponse = Either<
    DeleteProductErrors.NotFound |
    DeleteProductErrors.DataCannotSave |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<boolean>
>

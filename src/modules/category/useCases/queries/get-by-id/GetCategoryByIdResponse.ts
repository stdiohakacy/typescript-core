import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../shared/core/Result";
import { GetCategoryByIdErrors } from "./GetCategoryByIdErrors";

export type GetCategoryByIdResponse = Either<
    GetCategoryByIdErrors.NotFound |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<any>
>

import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../shared/core/Result";
import { PaginationResult } from "../../../../../shared/domain/PaginationResult";
import { Product } from "../../../domain/aggregateRoots/Product";
import { GetProductsByCategoryErrors } from "./GetProductsByCategoryErrors";

export type GetProductByCategoryResponse = Either<
    GetProductsByCategoryErrors.CategoryNotFound |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<PaginationResult<Product>>
>

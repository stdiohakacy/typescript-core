import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../shared/core/Result";
import { Product } from "../../../domain/aggregateRoots/Product";
import { GetProductByIdErrors } from "./GetProductByIdErrors";

export type GetProductByIdResponse = Either<
    GetProductByIdErrors.NotFound |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<Product>
>

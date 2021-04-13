import { Either, Result } from "../../../../../shared/core/Result";
import { PaginationResult } from "../../../../../shared/domain/PaginationResult";
import { Category } from "../../../domain/aggregateRoots/Category";

export type FindCategoriesResponse = Either<
    Result<any>,
    Result<PaginationResult<Category>>
>

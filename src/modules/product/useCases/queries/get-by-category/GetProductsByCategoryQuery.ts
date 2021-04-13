import { QueryPagination } from "../../../../../shared/domain/QueryPagination";

export class GetProductsByCategoryQuery extends QueryPagination {
    categoryId: string;
}

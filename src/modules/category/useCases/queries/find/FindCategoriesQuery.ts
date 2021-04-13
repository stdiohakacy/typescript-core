import { QueryPagination } from "../../../../../shared/domain/QueryPagination";

export class FindCategoriesQuery extends QueryPagination {
    keyword: string | null
}
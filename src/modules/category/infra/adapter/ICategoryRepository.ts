import { DbPagination } from "../../../../shared/infra/databases/DbPagination";
import { IBaseRepository } from "../../../../shared/infra/repositories/IBaseRepository";
import { Category } from "../../domain/aggregateRoots/Category";

export class FindCategoryFilter extends DbPagination {
    keyword: string | null
}

export interface ICategoryRepository extends IBaseRepository<Category, string> {
    isNameExist(name: string): Promise<boolean>
}
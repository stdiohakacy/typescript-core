import { Result, right } from './../../../../../shared/core/Result';
import { PaginationResult } from './../../../../../shared/domain/PaginationResult';
import { FindCategoryFilter } from './../../../infra/adapter/ICategoryRepository';
import { Inject, Service } from "typedi";
import { IUseCaseQueryCQRS } from "../../../../../shared/core/IUseCase";
import { CategoryRepository } from "../../../infra/repositories/CategoryRepository";
import { FindCategoriesQuery } from "./FindCategoriesQuery";
import { FindCategoriesResponse } from "./FindCategoriesResponse";

@Service()
export class FindCategoriesUseCase implements IUseCaseQueryCQRS<FindCategoriesQuery, FindCategoriesResponse> {
    @Inject('category.repository')
    private readonly _categoryRepository: CategoryRepository

    async handler(param: FindCategoriesQuery): Promise<FindCategoriesResponse> {
        const filter = new FindCategoryFilter();
        filter.setPagination(param.skip, param.limit);
        filter.keyword = param.keyword;
        const [categories, count] = await this._categoryRepository.findAndCount(filter);
        return right(Result.OK(new PaginationResult(categories, count, param.skip, param.limit)))
    }
}
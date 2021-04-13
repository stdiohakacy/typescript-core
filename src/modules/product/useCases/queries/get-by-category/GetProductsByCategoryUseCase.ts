import { FindCategoryFilter } from './../../../../category/infra/adapter/ICategoryRepository';
import { Result, right } from '../../../../../shared/core/Result';
import { Inject, Service } from "typedi";
import { IUseCaseQueryCQRS } from "../../../../../shared/core/IUseCase";
import { left } from '../../../../../shared/core/Result';
import * as validator from 'class-validator'
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { ProductRepository } from '../../../infra/repositories/ProductRepository';
import { GetProductByCategoryResponse } from './GetProductsByCategoryResponse';
import { CategoryRepository } from '../../../../category/infra/repositories/CategoryRepository';
import { GetProductsByCategoryQuery } from './GetProductsByCategoryQuery';
import { GetProductsByCategoryErrors } from './GetProductsByCategoryErrors';
import { PaginationResult } from '../../../../../shared/domain/PaginationResult';

@Service()
export class GetProductsByCategoryUseCase implements IUseCaseQueryCQRS<GetProductsByCategoryQuery, GetProductByCategoryResponse> {
    @Inject('product.repository')
    private readonly _productRepository: ProductRepository
    @Inject('category.repository')
    private readonly _categoryRepository: CategoryRepository

    async handler(param: GetProductsByCategoryQuery): Promise<GetProductByCategoryResponse> {
        if (!param.categoryId)
            return left(Result.fail('The category id is required!'))
        if (!validator.isUUID(param.categoryId))
            return left(Result.fail('The category id is invalid!'))

        const filter = new FindCategoryFilter();
        filter.setPagination(param.skip, param.limit);
        try {
            const isCategoryExist = await this._categoryRepository.getById(param.categoryId)
            if (!isCategoryExist)
                return left(new GetProductsByCategoryErrors.CategoryNotFound())
            const [products, count] = await this._productRepository.getByCategory(param.categoryId)
            return right(Result.OK(new PaginationResult(products, count, param.skip, param.limit)))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}

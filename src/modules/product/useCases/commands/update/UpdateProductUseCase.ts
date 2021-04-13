import * as validator from 'class-validator'
import { Inject, Service } from 'typedi';
import { right } from '../../../../../shared/core/Result';
import { left, Result } from "../../../../../shared/core/Result";
import { IUseCaseCommandCQRS } from '../../../../../shared/core/IUseCase';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { UpdateProductCommand } from './UpdateProductCommand';
import { UpdateProductResponse } from './UpdateProductResponse';
import { ProductRepository } from '../../../infra/repositories/ProductRepository';
import { CategoryRepository } from '../../../../category/infra/repositories/CategoryRepository';
import { ProductName } from '../../../domain/valueObjects/ProductName';
import { UpdateProductErrors } from './UpdateProductErrors';
import { Product } from '../../../domain/aggregateRoots/Product';

@Service()
export class UpdateProductUseCase implements IUseCaseCommandCQRS<UpdateProductCommand, UpdateProductResponse> {
    @Inject('category.repository')
    private readonly _categoryRepository: CategoryRepository
    @Inject('product.repository')
    private readonly _productRepository: ProductRepository

    async handler(param: UpdateProductCommand): Promise<UpdateProductResponse> {
        if (!param.id)
            return left(Result.fail('The id is required!'))
        if (!validator.isUUID(param.id))
            return left(Result.fail('The id is invalid!'))
        if (param.price) {
            if (param.price < 0 || param.price > 5000000)
                return left(Result.fail('The product price is invalid'))
        }
        if (param.categoryId) {
            if (!validator.isUUID(param.categoryId))
                return left(Result.fail('The category id is invalid!'))
        }

        const productNameOrError = ProductName.create({ value: param.name })
        if (productNameOrError.isFailure)
            return left(Result.fail(productNameOrError.error.toString()))
        const name = productNameOrError.getValue()

        try {
            const isExist = await this._productRepository.getById(param.id)
            if (!isExist)
                return left(new UpdateProductErrors.NotFound())
            if (param.categoryId) {
                const isCategoryExist = await this._categoryRepository.getById(param.categoryId)
                if (!isCategoryExist)
                    return left(new UpdateProductErrors.CategoryNotFound)
            }
            const productOrError = Product.create({ name, price: param.price, categoryId: param.categoryId })
            if (productOrError.isFailure)
                return left(Result.fail(productOrError.error.toString()))
            const product = productOrError.getValue()
            const isUpdated = await this._productRepository.update(param.id, product)
            if (!isUpdated)
                return left(new UpdateProductErrors.DataCannotSave())
            return right(Result.OK(isUpdated))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
import { ProductName } from './../../../domain/valueObjects/ProductName';
import { CreateProductResponse } from './CreateProductResponse';
import { right } from '../../../../../shared/core/Result';
import { left, Result } from "../../../../../shared/core/Result";
import { CreateProductCommand } from "./CreateProductCommand";
import { IUseCaseCommandCQRS } from '../../../../../shared/core/IUseCase';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { Inject, Service } from 'typedi';
import { ProductRepository } from '../../../infra/repositories/ProductRepository';
import * as validator from 'class-validator'
import { CategoryRepository } from '../../../../category/infra/repositories/CategoryRepository';
import { CreateProductErrors } from './CreateProductErrors';
import { Product } from '../../../domain/aggregateRoots/Product';

@Service()
export class CreateProductUseCase implements IUseCaseCommandCQRS<CreateProductCommand, CreateProductResponse> {
    @Inject('product.repository')
    private readonly _productRepository: ProductRepository
    @Inject('category.repository')
    private readonly _categoryRepository: CategoryRepository

    async handler(param: CreateProductCommand): Promise<CreateProductResponse> {
        if (!param.categoryId)
            return left(Result.fail('The category id is required!'))

        if (!param.price)
            return left(Result.fail('The product price is required!'))

        if (!validator.isUUID(param.categoryId))
            return left(Result.fail('The category id is invalid!'))

        const productNameOrError = ProductName.create({ value: param.name })
        if (productNameOrError.isFailure)
            return left(Result.fail(productNameOrError.error.toString()))

        const name = productNameOrError.getValue()

        try {
            const isCategoryExist = await this._categoryRepository.getById(param.categoryId)
            if (!isCategoryExist)
                return left(new CreateProductErrors.CategoryNotFound())
            const isExist = await this._productRepository.isNameExist(param.name)
            if (isExist)
                return left(new CreateProductErrors.NameAlreadyExist(param.name))
            const productOrError = Product.create({ name, price: param.price, categoryId: param.categoryId })
            if (productOrError.isFailure)
                return left(Result.fail(productOrError.error.toString()))
            const product = productOrError.getValue()
            const id = await this._productRepository.create(product)
            if (!id)
                return left(new CreateProductErrors.DataCannotSave)
            return right(Result.OK(id))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
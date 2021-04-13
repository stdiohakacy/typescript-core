import * as validator from 'class-validator'
import { Inject, Service } from 'typedi';
import { left, Result, right } from "../../../../../shared/core/Result";
import { IUseCaseCommandCQRS } from '../../../../../shared/core/IUseCase';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { DeleteProductCommand } from './DeleteProductCommand';
import { DeleteProductResponse } from './DeleteProductResponse';
import { ProductRepository } from '../../../infra/repositories/ProductRepository';
import { DeleteProductErrors } from './DeleteProductErrors';

@Service()
export class DeleteProductUseCase implements IUseCaseCommandCQRS<DeleteProductCommand, DeleteProductResponse> {
    @Inject('product.repository')
    private readonly _productRepository: ProductRepository

    async handler(param: DeleteProductCommand): Promise<DeleteProductResponse> {
        if (!param.id)
            return left(Result.fail('The id is required!'))
        if (!validator.isUUID(param.id))
            return left(Result.fail('The id is invalid!'))

        try {
            const isExist = await this._productRepository.getById(param.id)
            if (!isExist)
                return left(new DeleteProductErrors.NotFound())
            const isDeleted = await this._productRepository.softDelete(param.id)
            if (!isDeleted)
                return left(new DeleteProductErrors.DataCannotSave())
            return right(Result.OK(isDeleted))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
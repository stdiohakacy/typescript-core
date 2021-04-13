import { Result, right } from '../../../../../shared/core/Result';
import { Inject, Service } from "typedi";
import { IUseCaseQueryCQRS } from "../../../../../shared/core/IUseCase";
import { left } from '../../../../../shared/core/Result';
import * as validator from 'class-validator'
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { GetProductByIdQuery } from './GetProductByIdQuery';
import { GetProductByIdResponse } from './GetProductByIdResponse';
import { ProductRepository } from '../../../infra/repositories/ProductRepository';
import { GetProductByIdErrors } from './GetProductByIdErrors';

@Service()
export class GetProductByIdUseCase implements IUseCaseQueryCQRS<GetProductByIdQuery, GetProductByIdResponse> {
    @Inject('product.repository')
    private readonly _productRepository: ProductRepository

    async handler(param?: GetProductByIdQuery): Promise<GetProductByIdResponse> {
        if (!param.id)
            return left(Result.fail('The id is required!'))

        if (!validator.isUUID(param.id))
            return left(Result.fail('The id is invalid!'))
        try {
            const product = await this._productRepository.getById(param.id)
            if (!product)
                return left(new GetProductByIdErrors.NotFound())
            return right(Result.OK(product))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}

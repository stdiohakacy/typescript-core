import { Result, right } from './../../../../../shared/core/Result';
import { GetCategoryByIdResponse } from './GetCategoryByIdResponse';
import { Inject, Service } from "typedi";
import { IUseCaseQueryCQRS } from "../../../../../shared/core/IUseCase";
import { CategoryRepository } from "../../../infra/repositories/CategoryRepository";
import { GetCategoryByIdQuery } from './GetCategoryByIdQuery';
import { left } from '../../../../../shared/core/Result';
import * as validator from 'class-validator'
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { GetCategoryByIdErrors } from './GetCategoryByIdErrors';

@Service()
export class GetCategoryByIdUseCase implements IUseCaseQueryCQRS<GetCategoryByIdQuery, GetCategoryByIdResponse> {
    @Inject('category.repository')
    private readonly _categoryRepository: CategoryRepository

    async handler(param?: GetCategoryByIdQuery): Promise<GetCategoryByIdResponse> {
        if (!param.id)
            return left(Result.fail('The id is required!'))

        if (!validator.isUUID(param.id))
            return left(Result.fail('The id is invalid!'))
        try {
            const category = await this._categoryRepository.getById(param.id)
            if (!category)
                return left(new GetCategoryByIdErrors.NotFound())
            return right(Result.OK(category))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}

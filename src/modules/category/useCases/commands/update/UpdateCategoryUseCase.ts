import { UpdateCategoryCommand } from './UpdateCategoryCommand';
import * as validator from 'class-validator'
import { Inject, Service } from 'typedi';
import { UpdateCategoryResponse } from './UpdateCategoryResponse';
import { CategoryRepository } from '../../../infra/repositories/CategoryRepository';
import { right } from '../../../../../shared/core/Result';
import { left, Result } from "../../../../../shared/core/Result";
import { IUseCaseCommandCQRS } from '../../../../../shared/core/IUseCase';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { CategoryName } from '../../../domain/valueObjects/CategoryName';
import { UpdateCategoryErrors } from './UpdateCategoryErrors';
import { Category } from '../../../domain/aggregateRoots/Category';

@Service()
export class UpdateCategoryUseCase implements IUseCaseCommandCQRS<UpdateCategoryCommand, UpdateCategoryResponse> {
    @Inject('category.repository')
    private readonly _categoryRepository: CategoryRepository

    async handler(param?: UpdateCategoryCommand): Promise<UpdateCategoryResponse> {
        if (!param.id)
            return left(Result.fail('The id is required!'))

        if (!validator.isUUID(param.id))
            return left(Result.fail('The id is invalid!'))

        const categoryNameOrError = CategoryName.create({ value: param.name })

        if (categoryNameOrError.isFailure)
            return left(Result.fail(categoryNameOrError.error.toString()))

        const name = categoryNameOrError.getValue()
        try {
            const isExist = await this._categoryRepository.getById(param.id)
            if (!isExist)
                return left(new UpdateCategoryErrors.NotFound())
            const categoryOrError = Category.create({ name })
            if (categoryOrError.isFailure)
                return left(Result.fail(categoryOrError.error.toString()))

            const category = categoryOrError.getValue()
            const isUpdated = await this._categoryRepository.update(param.id, category)

            if (!isUpdated)
                return left(new UpdateCategoryErrors.DataCannotSave())
            return right(Result.OK(isUpdated))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
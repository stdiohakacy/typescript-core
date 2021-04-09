import * as validator from 'class-validator'
import { DeleteCategoryCommand } from './DeleteCategoryCommand';
import { CategoryRepository } from '../../../infra/repositories/CategoryRepository';
import { right } from '../../../../../shared/core/Result';
import { left, Result } from "../../../../../shared/core/Result";
import { IUseCaseCommandCQRS } from '../../../../../shared/core/IUseCase';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { Inject, Service } from 'typedi';
import { DeleteCategoryResponse } from './DeleteCategoryResponse';
import { DeleteCategoryErrors } from './DeleteCategoryErrors';

@Service()
export class DeleteCategoryUseCase implements IUseCaseCommandCQRS<DeleteCategoryCommand, DeleteCategoryResponse> {
    @Inject('category.repository')
    private readonly _categoryRepository: CategoryRepository

    async handler(param: DeleteCategoryCommand): Promise<DeleteCategoryResponse> {
        if (!param.id)
            return left(Result.fail('The id is required!'))

        if (!validator.isUUID(param.id))
            return left(Result.fail('The id is invalid!'))

        try {
            const isExist = await this._categoryRepository.getById(param.id)
            if (!isExist)
                return left(new DeleteCategoryErrors.NotFound())
            const isDeleted = await this._categoryRepository.softDelete(param.id)
            if (!isDeleted)
                return left(new DeleteCategoryErrors.DataCannotSave())
            return right(Result.OK(isDeleted))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
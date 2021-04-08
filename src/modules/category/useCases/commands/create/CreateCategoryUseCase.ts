import { CreateCategoryResponse } from './CreateRoomTypeResponse';
import { CategoryRepository } from './../../../infra/repositories/CategoryRepository';
import { right } from '../../../../../shared/core/Result';
import { left, Result } from "../../../../../shared/core/Result";
import { CreateCategoryCommand } from "./CreateCategoryCommand";
import { IUseCaseCommandCQRS } from '../../../../../shared/core/IUseCase';
import { ApplicationError } from '../../../../../shared/core/ApplicationError';
import { Inject, Service } from 'typedi';
import { CategoryName } from '../../../domain/valueObjects/CategoryName';
import { CreateCategoryErrors } from './CreateRoomTypeErrors';
import { Category } from '../../../domain/aggregateRoots/Category';


@Service()
export class CreateCategoryUseCase implements IUseCaseCommandCQRS<CreateCategoryCommand, CreateCategoryResponse> {
    @Inject('category.repository')
    private readonly _categoryRepository: CategoryRepository

    async handler(param?: CreateCategoryCommand): Promise<any> {
        const categoryNameOrError = CategoryName.create({ value: param.name })

        if (categoryNameOrError.isFailure)
            return left(Result.fail(categoryNameOrError.error.toString()))

        const name = categoryNameOrError.getValue()

        try {
            const isNameExist = await this._categoryRepository.isNameExist(name.value)

            if (isNameExist)
                return left(new CreateCategoryErrors.NameAlreadyExist(name.value))

            const categoryOrError = Category.create({ name })
            if (categoryOrError.isFailure)
                return left(Result.fail(categoryOrError.error.toString()))

            const category = categoryOrError.getValue()
            const id = await this._categoryRepository.create(category)
            if (!id)
                return left(new CreateCategoryErrors.DataCannotSave())
            return right(Result.OK(id))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
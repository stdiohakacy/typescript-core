import { DeleteCategoryUseCase } from './../useCases/commands/delete/DeleteCategoryUseCase';
import { UpdateCategoryUseCase } from './../useCases/commands/update/UpdateCategoryUseCase';
import { Response } from "express";
import Container from 'typedi';
import { Body, Delete, JsonController, Param, Params, Put, Res } from "routing-controllers";
import { BaseController } from "../../../shared/controllers/BaseController";
import { UpdateCategoryCommand } from '../useCases/commands/update/UpdateCategoryCommand';
import { UpdateCategoryErrors } from '../useCases/commands/update/UpdateCategoryErrors';
import { DeleteCategoryCommand } from '../useCases/commands/delete/DeleteCategoryCommand';
import { DeleteCategoryErrors } from '../useCases/commands/delete/DeleteCategoryErrors';

@JsonController('/v1')
export class DeleteCategoryController extends BaseController {
    constructor(
        private readonly _deleteCategoryUseCase: DeleteCategoryUseCase = Container.get(DeleteCategoryUseCase)
    ) { super() }

    @Delete('/categories/:id([0-9a-f-]{36})')
    async executeImpl(
        @Params() param: DeleteCategoryCommand,
        @Res() res: Response
    ): Promise<Response> {
        try {
            const result = await this._deleteCategoryUseCase.handler(param);
            const resultValue = result.value

            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case DeleteCategoryErrors.NotFound:
                        return this.notFound(res, resultValue.errorValue())
                    case UpdateCategoryErrors.DataCannotSave:
                        return this.fail(res, resultValue.errorValue())
                    default:
                        return this.fail(res, resultValue.errorValue())
                }
            }
            else
                return this.OK(res, resultValue.getValue())
        } catch (error) {
            console.error(error)
            return this.fail(res, error)
        }
    }
}
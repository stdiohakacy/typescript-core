import { UpdateCategoryUseCase } from './../useCases/commands/update/UpdateCategoryUseCase';
import { Response } from "express";
import Container from 'typedi';
import { Body, JsonController, Param, Put, Res } from "routing-controllers";
import { BaseController } from "../../../shared/controllers/BaseController";
import { UpdateCategoryCommand } from '../useCases/commands/update/UpdateCategoryCommand';
import { UpdateCategoryErrors } from '../useCases/commands/update/UpdateCategoryErrors';

@JsonController('/v1')
export class UpdateCategoryController extends BaseController {
    constructor(
        private readonly _updateCategoryUseCase: UpdateCategoryUseCase = Container.get(UpdateCategoryUseCase)
    ) { super() }

    @Put('/categories/:id([0-9a-f-]{36})')
    async executeImpl(
        @Body() param: UpdateCategoryCommand,
        @Res() res: Response,
        @Param('id') id: string
    ): Promise<Response> {
        param.id = id;
        console.log(param)
        try {
            const result = await this._updateCategoryUseCase.handler(param);
            const resultValue = result.value

            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case UpdateCategoryErrors.NotFound:
                        return this.notFound(res, resultValue.errorValue())
                    case UpdateCategoryErrors.NameAlreadyExist:
                        return this.conflict(res, resultValue.errorValue())
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
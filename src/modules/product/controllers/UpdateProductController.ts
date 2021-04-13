import { UpdateProductUseCase } from './../useCases/commands/update/UpdateProductUseCase';
import { Response } from "express";
import Container from 'typedi';
import { Body, JsonController, Param, Put, Res } from "routing-controllers";
import { BaseController } from "../../../shared/controllers/BaseController";
import { UpdateProductCommand } from '../useCases/commands/update/UpdateProductCommand';
import { UpdateProductErrors } from '../useCases/commands/update/UpdateProductErrors';

@JsonController('/v1')
export class UpdateCategoryController extends BaseController {
    constructor(
        private readonly _updateProductUseCase: UpdateProductUseCase = Container.get(UpdateProductUseCase)
    ) { super() }

    @Put('/products/:id([0-9a-f-]{36})')
    async executeImpl(
        @Body() param: UpdateProductCommand,
        @Res() res: Response,
        @Param('id') id: string
    ): Promise<Response> {
        param.id = id;
        try {
            const result = await this._updateProductUseCase.handler(param);
            const resultValue = result.value
            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case UpdateProductErrors.CategoryNotFound:
                        return this.notFound(res, resultValue.errorValue())
                    case UpdateProductErrors.DataCannotSave:
                        return this.fail(res, resultValue.errorValue())
                    case UpdateProductErrors.NameAlreadyExist:
                        return this.notFound(res, resultValue.errorValue())
                    case UpdateProductErrors.NotFound:
                        return this.notFound(res, resultValue.errorValue())
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
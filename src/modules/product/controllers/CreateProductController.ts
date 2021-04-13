import { CreateProductUseCase } from './../useCases/commands/create/CreateProductUseCase';
import { Response } from "express";
import Container from 'typedi';
import { Body, JsonController, Post, Res } from "routing-controllers";
import { BaseController } from "../../../shared/controllers/BaseController";
import { CreateProductCommand } from '../useCases/commands/create/CreateProductCommand';
import { CreateProductErrors } from '../useCases/commands/create/CreateProductErrors';

@JsonController('/v1')
export class CreateProductController extends BaseController {
    constructor(
        private readonly _createProductUseCase: CreateProductUseCase = Container.get(CreateProductUseCase)
    ) { super() }

    @Post('/products')
    async executeImpl(@Body() param: CreateProductCommand, @Res() res: Response): Promise<Response> {
        try {
            const result = await this._createProductUseCase.handler(param);
            const resultValue = result.value

            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case CreateProductErrors.CategoryNotFound:
                        return this.notFound(res, resultValue.errorValue())
                    case CreateProductErrors.NameAlreadyExist:
                        return this.conflict(res, resultValue.errorValue())
                    case CreateProductErrors.DataCannotSave:
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
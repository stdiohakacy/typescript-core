import { GetCategoryByIdUseCase } from './../useCases/queries/get-by-id/GetCategoryByIdUseCase';
import { Response } from "express";
import Container from 'typedi';
import { Get, JsonController, Params, Post, Res } from "routing-controllers";
import { BaseController } from "../../../shared/controllers/BaseController";
import { GetCategoryByIdQuery } from "../useCases/queries/get-by-id/GetCategoryByIdQuery";
import { GetCategoryByIdErrors } from '../useCases/queries/get-by-id/GetCategoryByIdErrors';

@JsonController('/v1')
export class CreateCategoryController extends BaseController {
    constructor(
        private readonly _getCategoryByIdUseCase: GetCategoryByIdUseCase = Container.get(GetCategoryByIdUseCase)
    ) { super() }

    @Get('/categories/:id([0-9a-f-]{36})')
    async executeImpl(@Params() param: GetCategoryByIdQuery, @Res() res: Response): Promise<Response> {
        try {
            const result = await this._getCategoryByIdUseCase.handler(param);
            const resultValue = result.value

            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case GetCategoryByIdErrors.NotFound:
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
import { GetCategoryByIdUseCase } from './../useCases/queries/get-by-id/GetCategoryByIdUseCase';
import { Response } from "express";
import Container from 'typedi';
import { Get, JsonController, Params, Post, QueryParams, Res } from "routing-controllers";
import { BaseController } from "../../../shared/controllers/BaseController";
import { GetCategoryByIdQuery } from "../useCases/queries/get-by-id/GetCategoryByIdQuery";
import { GetCategoryByIdErrors } from '../useCases/queries/get-by-id/GetCategoryByIdErrors';
import { FindCategoriesQuery } from '../useCases/queries/find/FindCategoriesQuery';
import { FindCategoriesUseCase } from '../useCases/queries/find/FIndCategoriesUseCase';

@JsonController('/v1')
export class CreateCategoryController extends BaseController {
    constructor(
        private readonly _findCategoriesUseCase: FindCategoriesUseCase = Container.get(FindCategoriesUseCase)
    ) { super() }

    @Get('/categories')
    async executeImpl(@QueryParams() param: FindCategoriesQuery, @Res() res: Response): Promise<Response> {
        try {
            const result = await this._findCategoriesUseCase.handler(param);
            const resultValue = result.value

            return this.OK(res, resultValue.getValue())
                
        } catch (error) {
            console.error(error)
            return this.fail(res, error)
        }
    }
}
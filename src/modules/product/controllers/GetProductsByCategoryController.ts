import { Response } from "express";
import Container from 'typedi';
import { Get, JsonController, Param, Params, Post, QueryParams, Res } from "routing-controllers";
import { BaseController } from "../../../shared/controllers/BaseController";
import { GetProductsByCategoryUseCase } from "../useCases/queries/get-by-category/GetProductsByCategoryUseCase";
import { GetProductsByCategoryQuery } from "../useCases/queries/get-by-category/GetProductsByCategoryQuery";

@JsonController('/v1')
export class CreateCategoryController extends BaseController {
    constructor(
        private readonly _getProductsByCategoryUseCase: GetProductsByCategoryUseCase = Container.get(GetProductsByCategoryUseCase)
    ) { super() }

    @Get('/categories/:categoryId([0-9a-f-]{36})/products')
    async executeImpl(@QueryParams() param: GetProductsByCategoryQuery, @Res() res: Response,@Param('categoryId') categoryId: string ): Promise<Response> {
        param.categoryId = categoryId
        try {
            const result = await this._getProductsByCategoryUseCase.handler(param);
            const resultValue = result.value

            return this.OK(res, resultValue.getValue())

        } catch (error) {
            console.error(error)
            return this.fail(res, error)
        }
    }
}
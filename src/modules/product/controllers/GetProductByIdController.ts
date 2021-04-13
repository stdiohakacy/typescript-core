import { Response } from "express";
import Container from 'typedi';
import { Get, JsonController, Params, Post, Res } from "routing-controllers";
import { BaseController } from "../../../shared/controllers/BaseController";
import { GetProductByIdUseCase } from "../useCases/queries/get-by-id/GetProductByIdUseCase";
import { GetProductByIdQuery } from "../useCases/queries/get-by-id/GetProductByIdQuery";
import { GetProductByIdErrors } from "../useCases/queries/get-by-id/GetProductByIdErrors";

@JsonController('/v1')
export class GetProductByIdController extends BaseController {
    constructor(
        private readonly _getProductByIdUseCase: GetProductByIdUseCase = Container.get(GetProductByIdUseCase)
    ) { super() }

    @Get('/products/:id([0-9a-f-]{36})')
    async executeImpl(@Params() param: GetProductByIdQuery, @Res() res: Response): Promise<Response> {
        try {
            const result = await this._getProductByIdUseCase.handler(param);
            const resultValue = result.value

            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case GetProductByIdErrors.NotFound:
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
import { Response } from "express";
import Container from 'typedi';
import { Body, Delete, JsonController, Param, Params, Put, Res } from "routing-controllers";
import { BaseController } from "../../../shared/controllers/BaseController";
import { DeleteProductUseCase } from "../useCases/commands/delete/DeleteProductUseCase";
import { DeleteProductCommand } from "../useCases/commands/delete/DeleteProductCommand";
import { DeleteProductErrors } from "../useCases/commands/delete/DeleteProductErrors";

@JsonController('/v1')
export class DeleteProductController extends BaseController {
    constructor(
        private readonly _deleteProductUseCase: DeleteProductUseCase = Container.get(DeleteProductUseCase)
    ) { super() }

    @Delete('/products/:id([0-9a-f-]{36})')
    async executeImpl(
        @Params() param: DeleteProductCommand,
        @Res() res: Response
    ): Promise<Response> {
        try {
            const result = await this._deleteProductUseCase.handler(param);
            const resultValue = result.value

            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case DeleteProductErrors.NotFound:
                        return this.notFound(res, resultValue.errorValue())
                    case DeleteProductErrors.DataCannotSave:
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
import { Response } from "express";
import { Body, JsonController, Post, Res } from "routing-controllers";
import Container from 'typedi';
import { BaseController } from "../../../shared/controllers/BaseController";
import { CreateCategoryCommand } from "../useCases/commands/create/CreateCategoryCommand";
import { CreateCategoryUseCase } from "../useCases/commands/create/CreateCategoryUseCase";
import { CreateCategoryErrors } from "../useCases/commands/create/CreateRoomTypeErrors";

@JsonController('/v1')
export class CreateCategoryController extends BaseController {
    constructor(
        private readonly _createCategoryUseCase: CreateCategoryUseCase = Container.get(CreateCategoryUseCase)
    ) { super() }

    @Post('/categories')
    async executeImpl(@Body() param: CreateCategoryCommand, @Res() res: Response): Promise<Response> {
        try {
            const result = await this._createCategoryUseCase.handler(param);
            const resultValue = result.value

            if (result.isLeft()) {
                switch (resultValue.constructor) {
                    case CreateCategoryErrors.NameAlreadyExist:
                        return this.conflict(res, resultValue.errorValue())
                    case CreateCategoryErrors.DataCannotSave:
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
import { Either, Result } from "../../../../../shared/core/Result";
import { RegisterUserErrors } from "./RegisterUserErrors";

export type RegisterUserResponse = Either<
    RegisterUserErrors.EmailAlreadyExist |
    RegisterUserErrors.DataCannotSave |
    Result<any>,
    Result<boolean>
>

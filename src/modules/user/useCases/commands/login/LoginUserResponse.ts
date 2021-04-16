import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../shared/core/Result";
import { UserAuthenticated } from "../../../domain/UserAuthenticated";
import { LoginUserErrors } from "./LoginUserErrors";

export type LoginUserResponse = Either<
    LoginUserErrors.AccountInvalid |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<UserAuthenticated>
>

import { ApplicationError } from "../../../../../shared/core/ApplicationError";
import { Either, Result } from "../../../../../shared/core/Result";
import { Channel } from "../../../domain/aggregateRoots/Channel";
import { GetSingleChannelErrors } from "./GetSingleChannelErrors";

export type GetSingleChannelResponse = Either<
    GetSingleChannelErrors.ToUserNotFound |
    ApplicationError.UnexpectedError |
    Result<any>,
    Result<Channel>
>

import * as validator from 'class-validator'
import { UserRepository } from './../../../../user/infra/repositories/UserRepository';
import { Inject, Service } from "typedi"
import { IUseCaseQueryCQRS } from "../../../../../shared/core/IUseCase"
import { left, Result, right } from "../../../../../shared/core/Result"
import { ChannelRepository } from "../../../infra/repositories/ChannelRepository"
import { GetSingleChannelQuery } from "./GetSingleChannelQuery"
import { GetSingleChannelResponse } from "./GetSingleChannelResponse"
import { ApplicationError } from "../../../../../shared/core/ApplicationError"
import { GetSingleChannelErrors } from './GetSingleChannelErrors';
import { Channel } from '../../../domain/aggregateRoots/Channel';
import { CreateChannelErrors } from '../commands/create/CreateChannelErrors';
import { ChannelId } from '../../../domain/entities/ChannelId';
import { UniqueEntityId } from '../../../../../shared/domain/UniqueEntityId';
import { UserId } from '../../../../user/domain/entities/UserId';
import { ChannelUser } from '../../../domain/entities/ChannelUser';
import { ChannelUserRepository } from '../../../infra/repositories/ChannelUserRepository';

@Service()
export class GetSingleChannelUseCase implements IUseCaseQueryCQRS<GetSingleChannelQuery, GetSingleChannelResponse> {
    @Inject('channel.repository')
    private readonly _channelRepository: ChannelRepository
    @Inject('user.repository')
    private readonly _userRepository: UserRepository
    @Inject('channel_user.repository')
    private readonly _channelUserRepository: ChannelUserRepository

    async handler(param: GetSingleChannelQuery): Promise<GetSingleChannelResponse> {
        const { fromUser, toUser } = param
        if (!fromUser)
            return left(Result.fail('Unauthorized!'))
        if (!toUser)
            return left(Result.fail('To user is required!'))
        if (!validator.isUUID(toUser))
            return left(Result.fail('To user is invalid!'))

        try {
            const isToUserExist = await this._userRepository.getById(toUser)
            if (!isToUserExist)
                return left(new GetSingleChannelErrors.ToUserNotFound())
            const channel = await this._channelRepository.getSingleChannel(fromUser, toUser)

            if (!channel) {
                const channel = Channel.create({ isDirect: true }).getValue()
                try {
                    const channelCreated = await this._channelRepository.createGet(channel)
                    if (!channelCreated)
                        return left(new CreateChannelErrors.DataCannotSave())
                    await Promise.all([fromUser, toUser].map(async userId => {
                        const channelId = ChannelId.create(new UniqueEntityId(channelCreated.id.toString())).getValue()
                        const uid = UserId.create(new UniqueEntityId(userId)).getValue()
                        const channelUserOrError = ChannelUser.create({ channelId, userId: uid })
                        if (channelUserOrError.isFailure)
                            return left(Result.fail(channelUserOrError.error.toString()))
                        const channelUser = channelUserOrError.getValue()
                        await this._channelUserRepository.create(channelUser)
                    }))
                    return right(Result.OK(channelCreated))
                } catch (error) {
                    console.error(error)
                    return left(new ApplicationError.UnexpectedError(error))
                }
            }
            else
                return right(Result.OK(channel))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
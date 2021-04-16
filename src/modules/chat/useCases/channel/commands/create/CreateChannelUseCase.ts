import { UserRepository } from './../../../../../user/infra/repositories/UserRepository';
import { ChannelUserRepository } from './../../../../infra/repositories/ChannelUserRepository';
import { ChannelName } from './../../../../domain/valueObjects/channel/ChannelName';
import { ChannelRepository } from './../../../../infra/repositories/ChannelRepository';
import { Inject, Service } from 'typedi';
import { right } from './../../../../../../shared/core/Result';
import { left, Result } from "../../../../../../shared/core/Result";
import { IUseCaseCommandCQRS } from '../../../../../../shared/core/IUseCase';
import { ApplicationError } from '../../../../../../shared/core/ApplicationError';
import { CreateChannelCommand } from './CreateChannelCommand';
import { CreateChannelResponse } from './CreateChannelResponse';
import { CreateChannelErrors } from './CreateChannelErrors';
import { Channel } from '../../../../domain/aggregateRoots/Channel';
import { ChannelUser } from '../../../../domain/entities/ChannelUser';
import { UserId } from '../../../../../user/domain/entities/UserId';
import { UniqueEntityId } from '../../../../../../shared/domain/UniqueEntityId';
import { ChannelId } from '../../../../domain/entities/ChannelId';
import * as validator from 'class-validator'

@Service()
export class CreateChannelUseCase implements IUseCaseCommandCQRS<CreateChannelCommand, CreateChannelResponse> {
    @Inject('channel.repository')
    private readonly _channelRepository: ChannelRepository
    @Inject('channel_user.repository')
    private readonly _channelUserRepository: ChannelUserRepository
    @Inject('user.repository')
    private readonly _userRepository: UserRepository

    async handler(param: CreateChannelCommand): Promise<CreateChannelResponse> {
        const { name, description, userIds } = param
        let channelName
        if (name) {
            const nameOrError = ChannelName.create({ value: name })
            if (nameOrError.isFailure)
                return left(Result.fail(nameOrError.error.toString()))
            channelName = nameOrError.getValue()
        }
        if (!userIds || userIds.length === 0)
            return left(Result.fail('List user id is required!'))

        for (let i = 0; i < userIds.length; i++) {
            if (!validator.isUUID(userIds[i]))
                return left(Result.fail('User id is invalid!'))
        }

        await Promise.all(userIds.map(async (userId: string) => {
            const isExist = await this._userRepository.getById(userId)
            if (!isExist)
                return left(Result.fail('User id is invalid!'))
        }))

        try {
            if (name) {
                const isNameExist = await this._channelRepository.isNameExist(name)
                if (isNameExist)
                    return left(new CreateChannelErrors.NameAlreadyExist(name))
            }
            const channelOrError = Channel.create({ name: channelName, description })
            if (channelOrError.isFailure)
                return left(Result.fail(channelOrError.error.toString()))

            const channel = channelOrError.getValue()
            try {
                const id = await this._channelRepository.create(channel)
                if (!id)
                    return left(new CreateChannelErrors.DataCannotSave())
                await Promise.all(userIds.map(async userId => {
                    const channelId = ChannelId.create(new UniqueEntityId(id)).getValue()
                    const uid = UserId.create(new UniqueEntityId(userId)).getValue()
                    const channelUserOrError = ChannelUser.create({ channelId, userId: uid })
                    if (channelUserOrError.isFailure)
                        return left(Result.fail(channelUserOrError.error.toString()))
                    const channelUser = channelUserOrError.getValue()
                    await this._channelUserRepository.create(channelUser)
                }))

                return right(Result.OK(id))
            } catch (error) {
                console.error(error)
                return left(new ApplicationError.UnexpectedError(error))
            }
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
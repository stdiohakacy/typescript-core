import { Result, right } from './../../../../../../shared/core/Result';
import { Inject, Service } from 'typedi';
import { IUseCaseCommandCQRS } from '../../../../../../shared/core/IUseCase';
import * as validator from 'class-validator'
import { CreateMessageCommand } from './CreateMessageCommand';
import { CreateMessageResponse } from './CreateMessageResponse';
import { MessageRepository } from '../../../../infra/repositories/MessageRepository';
import { left } from '../../../../../../shared/core/Result';
import { ApplicationError } from '../../../../../../shared/core/ApplicationError';
import { ChannelRepository } from '../../../../infra/repositories/ChannelRepository';
import { CreateMessageErrors } from './CreateMessageErrors';
import { Message } from '../../../../domain/entities/Message';
import { UserId } from '../../../../../user/domain/entities/UserId';
import { UniqueEntityId } from '../../../../../../shared/domain/UniqueEntityId';
import { ChannelId } from '../../../../domain/entities/ChannelId';

@Service()
export class CreateMessageUseCase implements IUseCaseCommandCQRS<CreateMessageCommand, CreateMessageResponse> {
    @Inject('message.repository')
    private readonly _messageRepository: MessageRepository
    @Inject('channel.repository')
    private readonly _channelRepository: ChannelRepository

    async handler(param: CreateMessageCommand): Promise<CreateMessageResponse> {
        const {
            userId,
            channelId,
            content,
            parentMessageId,
            type,
            status,
            isPin,
            isStar
        } = param

        if (!userId)
            return left(Result.fail('The user id is required!'))
        if (!validator.isUUID(userId))
            return left(Result.fail('The user id is invalid!'))
        if (!channelId)
            return left(Result.fail('The channel id is required!'))
        if (!validator.isUUID(channelId))
            return left(Result.fail('The channel id is invalid!'))
        if (!content)
            return left(Result.fail('The content is invalid!'))

        try {
            const isChannelExist = await this._channelRepository.getById(channelId)
            if (!isChannelExist)
                return left(new CreateMessageErrors.ChannelNotFound())
            const messageOrError = Message.create({
                userId: UserId.create(new UniqueEntityId(userId)).getValue(),
                channelId: ChannelId.create(new UniqueEntityId(channelId)).getValue(),
                content,
                parentMessageId,
                type,
                status,
                isPin,
                isStar
            })
            if (messageOrError.isFailure)
                return left(Result.fail(messageOrError.error.toString()))

            const message = messageOrError.getValue()
            const id = await this._messageRepository.create(message)
            if (!id)
                return left(new CreateMessageErrors.DataCannotSave())
            return right(Result.OK(id))
        } catch (error) {
            console.error(error)
            return left(new ApplicationError.UnexpectedError(error))
        }
    }
}
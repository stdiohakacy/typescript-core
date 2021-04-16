import { Service } from 'typedi';
import { BaseRepository } from '../../../../shared/infra/repositories/BaseRepository';
import { Message } from '../../domain/entities/Message';
import { MessageDb } from '../../../../shared/infra/databases/typeorm/entities/MessageDb';
import { IMessageRepository } from '../adapter/IMessageRepository';

@Service('message.repository')
export class MessageRepository extends BaseRepository<Message, MessageDb, string> implements IMessageRepository {
    constructor() {
        super(MessageDb, {
            TABLE_NAME: 'message'
        })
    }
}

import { MessageStatus } from '../../../../domain/enums/MessageStatus';
import { MessageType } from './../../../../domain/enums/MessageType';

export class CreateMessageCommand {
    fromUser: string;
    channelId: string;
    parentMessageId?: string;
    content: string;
    // fileUrls?: string[];
    type?: MessageType;
    status?: MessageStatus;
    isPin?: boolean;
    isStar?: boolean;
}

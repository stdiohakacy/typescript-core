import { IBaseRepository } from "../../../../shared/infra/repositories/IBaseRepository";
import { Message } from "../../domain/entities/Message";

export interface IMessageRepository extends IBaseRepository<Message, string> { }
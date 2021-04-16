import { IUserRepository } from './../adapter/IUserRepository';
import { UserDb } from './../../../../shared/infra/databases/typeorm/entities/UserDb';
import { Service } from 'typedi';
import { RoomTypeDb } from "../../../../shared/infra/databases/typeorm/entities/RoomTypeDb";
import { BaseRepository } from '../../../../shared/infra/repositories/BaseRepository';
import { User } from '../../domain/aggregateRoots/User';

@Service('user.repository')
export class UserRepository extends BaseRepository<User, UserDb, string> implements IUserRepository {
    constructor() {
        super(UserDb, {
            TABLE_NAME: 'user'
        })
    }

    async getByEmail(email: string): Promise<User> {
        const user = await this.repository
            .createQueryBuilder('user')
            .where(`LOWER(user.email) = LOWER(:email)`, { email })
            .getOne();
        return user ? user.toEntity() : null;
    }
}

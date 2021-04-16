import { IBaseRepository } from "../../../../shared/infra/repositories/IBaseRepository";
import { User } from "../../domain/aggregateRoots/User";

export interface IUserRepository extends IBaseRepository<User, string> {
    getByEmail(email: string): Promise<User>;
}
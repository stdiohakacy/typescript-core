import { IBaseRepository } from "../../../../shared/infra/repositories/IBaseRepository";
import { Category } from "../../domain/aggregateRoots/Category";

export interface ICategoryRepository extends IBaseRepository<Category, string> {
    isNameExist(name: string): Promise<boolean>
}
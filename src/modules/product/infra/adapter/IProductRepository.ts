import { IBaseRepository } from "../../../../shared/infra/repositories/IBaseRepository";
import { Product } from "../../domain/aggregateRoots/Product";

export interface IProductRepository extends IBaseRepository<Product, string> {
    isNameExist(name: string): Promise<boolean>
    getByCategory(categoryId: string): Promise<[Product[], number]>
}
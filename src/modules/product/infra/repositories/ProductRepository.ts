import { ProductDb } from './../../../../shared/infra/databases/typeorm/entities/ProductDb';
import { Service } from 'typedi';
import { BaseRepository } from '../../../../shared/infra/repositories/BaseRepository';
import { Product } from '../../domain/aggregateRoots/Product';
import { IProductRepository } from '../adapter/IProductRepository';

@Service('product.repository')
export class ProductRepository extends BaseRepository<Product, ProductDb, string> implements IProductRepository {
    constructor() {
        super(ProductDb, {
            TABLE_NAME: 'product'
        })
    }

    async isNameExist(name: string): Promise<boolean> {
        let query = this.repository
            .createQueryBuilder('product')
            .where(`LOWER(product.name) = LOWER(:name)`, { name });

        return !!await query.getOne();
    }

    async getByCategory(categoryId: string): Promise<[Product[], number]> {
        const query = this.repository
            .createQueryBuilder('product')
            .where('product.categoryId = :categoryId', { categoryId })

        const [products, count] = await query.getManyAndCount();
        return [products.map(product => product.toEntity()), count];
    }
}

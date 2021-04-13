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
            .createQueryBuilder('')
            .where(`LOWER(.name) = LOWER(:name)`, { name });

        return !!await query.getOne();
    }
}

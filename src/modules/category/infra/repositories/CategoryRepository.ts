import { Service } from 'typedi';
import { CategoryDb } from '../../../../shared/infra/databases/typeorm/entities/CategoryDb';
import { BaseRepository } from '../../../../shared/infra/repositories/BaseRepository';
import { Category } from '../../domain/aggregateRoots/Category';
import { ICategoryRepository } from '../adapter/ICategoryRepository';

@Service('category.repository')
export class CategoryRepository extends BaseRepository<Category, CategoryDb, string> implements ICategoryRepository {
    constructor() {
        super(CategoryDb, {
            TABLE_NAME: 'category'
        })
    }

    async isNameExist(name: string): Promise<boolean> {
        let query = this.repository
            .createQueryBuilder('category')
            .where(`LOWER(category.name) = LOWER(:name)`, { name });

        return !!await query.getOne();
    }
}

import { getRepository, QueryRunner, Repository } from "typeorm";
import { IEntity } from "../../domain/base/IEntity";
import { BaseEntityDb } from "../databases/typeorm/entities/BaseEntityDb";
import { IBaseRepository } from "./IBaseRepository";

export abstract class BaseRepository<
    TEntity extends IEntity,
    TEntityDb extends BaseEntityDb<TEntity>,
    TIdentityType
    >
    implements IBaseRepository<IEntity, TIdentityType> {
    protected readonly repository: Repository<TEntityDb>;

    constructor(
        private _type: { new(): TEntityDb },
        private _schema: { TABLE_NAME: string }
    ) {
        this.repository = getRepository(this._type);
    }

    async create(data: TEntity): Promise<TIdentityType> {
        const result = await this.repository
            .createQueryBuilder(this._schema.TABLE_NAME)
            .insert()
            .values(new this._type().fromEntity(data) as any)
            .execute()
        return result.identifiers
            && result.identifiers.length
            && result.identifiers[0].id
    }
}


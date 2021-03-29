import { IEntity } from './../../../../domain/base/IEntity';
import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from "typeorm";

export abstract class BaseEntityDb<T extends IEntity> {
    @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
    createdAt: Date

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
    updatedAt: Date

    @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
    deletedAt: Date | null

    /* handlers */

    abstract toEntity(): T;
    abstract fromEntity(entity: T): IEntity;
}

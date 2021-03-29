import { Connection } from 'typeorm';
import { MessageError } from '../../exceptions/message/MessageError';
import { SystemError } from '../../exceptions/SystemError';
import { IDbConnection } from './interfaces/IDbConnection';
import { IDbMigration } from './interfaces/IDbMigration';
import { IDbQueryRunner } from './interfaces/IDbQueryRunner';
import { TransactionIsolationLevel } from './TransactionIsolationLevel';

export class DbConnection implements IDbConnection {
    constructor(private _connection: Connection) { }

    async clearCaching(keyCaching: string): Promise<void> {
        if (!keyCaching)
            throw new SystemError(MessageError.PARAM_REQUIRED, 'key caching');

        if (!this._connection.queryResultCache)
            throw new SystemError(MessageError.PARAM_NOT_SUPPORTED, 'caching feature');

        await this._connection.queryResultCache.remove([keyCaching]);
    }

    async runTransaction<T>(
        runInTransaction: (queryRunner: IDbQueryRunner) => Promise<T>,
        rollback?: (error: Error) => Promise<void>,
        done?: () => Promise<void>,
        isolationLevel?: TransactionIsolationLevel
    ): Promise<T | null> {
        let result: T | null = null;
        let err;
        const query = this._connection.createQueryRunner();
        await query.startTransaction(isolationLevel);

        try {
            result = await runInTransaction(query);
            await query.commitTransaction();
        }
        catch (error) {
            err = error;
            await query.rollbackTransaction();
        }
        finally {
            await query.release();
        }

        if (err) {
            if (rollback)
                await rollback(err);
            throw err;
        }
        else if (done)
            await done();
        return result;
    }

    async runMigrations(options?: { transaction?: 'all' | 'none' | 'each' }): Promise<IDbMigration[]> {
        return await this._connection.runMigrations(options);
    }
}

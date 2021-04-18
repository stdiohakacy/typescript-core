import * as redis from 'redis';
import { Service } from 'typedi';

export interface IRedisContext {
    count(key: string): Promise<number>;
    isExist(key: string): Promise<boolean>;
    getOne<T>(key: string): Promise<T>;
    getAllKeys(wildCard: string): Promise<string[]>;
    getAllKeyValue(wildCard: string): Promise<any[]>;
    set(key: string, value: any): Promise<any>;
    deleteOne(key: string): Promise<number>
}

@Service('redis.context')
export class RedisContext implements IRedisContext {
    private _connection: redis.RedisClient;
    private tokenExpireTime: number = 604800;

    constructor(connection?: redis.RedisClient) {
        if (connection)
            this._connection = connection;
    }

    get redisClient(): redis.RedisClient {
        if (!this._connection) {
            throw new Error(`[Redis]: Redis client is not existed!`)
        }
        console.log('[Redis]: Redis client connected')
        return this._connection;
    }

    public createConnection(redisLib = redis): redis.RedisClient {
        if (this._connection && this._connection.connected) {
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
            console.log('Exist connection')
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
            return this._connection;
        }

        this._connection = redisLib.createClient({
            host: 'localhost',
            port: 6379,
        } as redis.ClientOpts) as redis.RedisClient;

        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
        console.log('Create redis connection!')
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')

        return this._connection;
    }

    public set(key: string, value: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.redisClient.set(key, value, (error, reply) => {
                if (error)
                    return reject(error)
                else {
                    this.redisClient.expire(key, this.tokenExpireTime)
                    return resolve(reply)
                }
            });
        })
    }

    getOne<T>(key: string): Promise<T> {
        return new Promise((resolve, reject) => {
            this.redisClient.get(key, (error: Error, reply: unknown) => {
                if (error)
                    return reject(error)
                return resolve(<T>reply);
            });
        })
    }

    count(key: string): Promise<number> {
        throw new Error('Method not implemented.');
    }
    isExist(key: string): Promise<boolean> {
        throw new Error('Method not implemented.');
    }

    getAllKeys(wildCard: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.redisClient.keys(wildCard,
                async (error: Error, results: string[]) => {
                    if (error)
                        return reject(error)
                    return resolve(results);
                })
        })
    }

    getAllKeyValue(wildCard: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            return this._connection.keys(wildCard,
                async (error: Error, results: string[]) => {
                    if (error)
                        return reject(error)
                    const allResults = await Promise.all(
                        results.map(async (key) => {
                            const value = await this.getOne(key)
                            return { key, value }
                        })
                    )
                    resolve(allResults)
                })
        })
    }

    deleteOne(key: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.redisClient.del(key, (error, reply) => {
                if (error)
                    return reject(error)
                return resolve(reply)
            })
        })
    }
}

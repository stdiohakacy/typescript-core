import { REDIS_CONFIG_HOST, REDIS_CONFIG_PORT } from './../../../configs/Configuration';
import { Service } from 'typedi';
import * as redis from 'redis';

export interface IRedisContext {
    count(key: string): Promise<number>;
    isExist(key: string): Promise<boolean>;
    getOne<T>(key: string): Promise<T>;
    getAllKeys(wildCard: string): Promise<string[]>;
    getAllKeyValue(wildCard: string): Promise<any[]>;
    set(key: string, value: any): Promise<any>;
    deleteOne(key: string): Promise<number>
}

export class RedisContext implements IRedisContext {
    private _connection: redis.RedisClient
    private tokenExpireTime: number = 604800

    constructor(connection?: redis.RedisClient) {
        if (connection)
            this._connection = connection
    }

    get getRedisClient(): redis.RedisClient {
        if (!this._connection)
            throw new Error(`The redis connection is not exists`)
        return this._connection
    }

    public createConnection(redisLib = redis): redis.RedisClient {
        if (this._connection && this._connection.connected)
            return this._connection

        this._connection = redisLib.createClient({
            host: REDIS_CONFIG_HOST,
            port: REDIS_CONFIG_PORT
        } as redis.ClientOpts) as redis.RedisClient
        return this._connection
    }

    async count(key: string): Promise<number> {
        const allKeys = await this.getAllKeys(key);
        return allKeys.length;
    }

    isExist(key: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            return this.count(key)
                .then((count) => resolve(count >= 1 ? true : false))
                .catch((err) => reject(err))
        })
    }

    getOne<T>(key: string): Promise<T> {
        return new Promise((resolve, reject) => {
            this.getRedisClient.get(key, (error: Error, reply: unknown) => {
                if (error)
                    return reject(error)
                return resolve(<T>reply);
            });
        })
    }

    getAllKeys(wildCard: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.getRedisClient.keys(wildCard,
                async (error: Error, results: string[]) => {
                    if (error)
                        return reject(error)
                    return resolve(results);
                })
        })
    }

    getAllKeyValue(wildCard: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            return this.getRedisClient.keys(wildCard,
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

    set(key: string, value: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getRedisClient.set(key, value,
                (error, reply) => {
                    if (error) reject(error)
                    else {
                        this.getRedisClient.expire(key, this.tokenExpireTime)
                        return resolve(reply)
                    }
                });
        })
    }

    deleteOne(key: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.getRedisClient.del(key, (error, reply) => {
                if (error)
                    return reject(error)
                return resolve(reply)
            })
        })
    }
}
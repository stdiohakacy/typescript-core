import * as redis from 'redis'
import * as redisCommands from 'redis-commands'
import { Service } from 'typedi'
import { REDIS_CONFIG_HOST, REDIS_CONFIG_PORT } from '../../../configs/Configuration'

export interface IRedisContext {
    readonly redisClient: redis.RedisClient;
    createConnection(): redis.RedisClient;
    createConnection(redisLib: any): redis.RedisClient;

    count(key: string): Promise<number>;
    isExist(key: string): Promise<boolean>;
    getOne<T>(key: string): Promise<T>;
    getAllKeys(wildCard: string): Promise<string[]>;
    getAllKeyValue(wildCard: string): Promise<any[]>;
    set(key: string, value: any): Promise<any>;
    deleteOne(key: string): Promise<number>
}

export class RedisContext implements IRedisContext {
    private tokenExpiryTime: number = 604800;
    private static instance: RedisContext
    private _connection: redis.RedisClient

    constructor(connection?: redis.RedisClient) {
        if (this._connection) this._connection = connection
    }

    public static getInstance(): RedisContext {
        if (!RedisContext.instance) {
            RedisContext.instance = new RedisContext()
        }
        return RedisContext.instance
    }

    get redisClient(): redis.RedisClient {
        if (!this._connection)
            throw new Error(`[Redis] - Redis connection fail`)
        return this._connection
    }

    createConnection(redisLib = redis): redis.RedisClient {
        if (this._connection && this._connection.connected)
            return this._connection

        this._connection = promisifyRedis(redisLib).createClient({
            host: REDIS_CONFIG_HOST,
            port: REDIS_CONFIG_PORT,
            // password: REDIS_CONFIG_PASSWORD,
            // prefix: REDIS_CONFIG_PREFIX
        } as redis.ClientOpts) as redis.RedisClient;
        return this._connection;
    }

    async getOne<T>(key: string): Promise<T> {
        return new Promise((resolve, reject) => {
            this.redisClient.get(key, (error: Error, reply: unknown) => {
                if (error)
                    return reject(error)
                return resolve(<T>reply);
            });
        })
    }

    async count(key: string): Promise<number> {
        const allKeys = await this.getAllKeys(key);
        return allKeys.length;
    }

    async isExist(key: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            return this.count(key)
                .then((count) => resolve(count >= 1 ? true : false))
                .catch((err) => reject(err))
        })
    }

    async getAllKeys(wildCard: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.redisClient.keys(wildCard,
                async (error: Error, results: string[]) => {
                    if (error)
                        return reject(error)
                    return resolve(results);
                })
        })
    }

    async getAllKeyValue(wildCard: string): Promise<any[]> {
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

    async deleteOne(key: string): Promise<number> {
        return new Promise((resolve, reject) => {
            this.redisClient.del(key, (error, reply) => {
                if (error)
                    return reject(error)
                return resolve(reply)
            })
        })
    }

    async set(key: string, value: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.redisClient.set(key, value,
                (error, reply) => {
                    if (error) {
                        return reject(error)
                    } else {
                        this.redisClient.expire(key, this.tokenExpiryTime)
                        return resolve(reply)
                    }
                });
        })
    }
}

const promisifyRedis = (redis) => {
    const mlproto = redis.Multi.prototype;
    const clproto = redis.RedisClient.prototype;

    const promisify = (f) => {
        return function () {
            const args = Array.prototype.slice.call(arguments);
            const that = this;
            if (typeof args[args.length - 1] === 'function') {
                return f.apply(this, args);
            }
            else {
                return promiseFactory(function (resolve, reject) {
                    args.push(createCb(resolve, reject));
                    f.apply(that, args);
                });
            }
        };
    };

    redisCommands.list.forEach(function (fullCommand) {
        const cmd = fullCommand.split(' ')[0];

        if (cmd !== 'multi') {
            clproto[cmd + 'Async'] = promisify(clproto[cmd]);
            clproto[cmd.toUpperCase() + 'ASYNC'] = clproto[cmd + 'Async'];
        }
    });

    // For Multi only `exec` command returns promise.
    mlproto.exec_transaction = promisify(mlproto.exec_transaction);
    mlproto.exec = mlproto.exec_transaction;
    mlproto.EXEC = mlproto.exec;

    return redis;
};

const createCb = (resolve, reject) => {
    return function (err, value) {
        if (err !== null)
            reject(err);

        else
            resolve(value);
    };
};

const promiseFactory = (resolver) => {
    return new Promise(resolver);
};

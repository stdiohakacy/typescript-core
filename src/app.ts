import * as path from 'path'
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { ApiService } from './shared/api/ApiService';
import { API_PORT, ENABLE_API_SERVICE, IS_DEVELOPMENT } from './shared/configs/Configuration';
import * as cluster from 'cluster';
import * as os from 'os';
import Container from "typedi";
import { RedisContext } from './shared/infra/databases/redis/RedisContext';

const startApplication = async () => {
    if (ENABLE_API_SERVICE)
        new ApiService().setup();
};

console.log(IS_DEVELOPMENT)

if (IS_DEVELOPMENT) {
    startApplication().then(async () => {
        // Start TypeORM
        createConnection()
        // Start Redis
        new RedisContext().createConnection()
        console.log(`App Express Server listening on port : ${API_PORT}`)
    });
}
else {
    if (cluster.isMaster) {
        const numCPUs = os.cpus().length
        // Fork workers.
        for (let i = 0; i < numCPUs; i++)
            cluster.fork();

        cluster.on('exit', worker => {
            cluster.fork();
            console.error(`Worker ${worker.process.pid} is died.`);
        });
    }
    else {
        startApplication().then(() => {
            console.info(`Worker ${process.pid} is started.`);
        }).catch((error: Error) => {
            console.error(error.stack || error.message);
            setTimeout(() => process.exit(), 2000);
        });
    }
}
// import * as path from 'path'
// import 'reflect-metadata';
// import { createExpressServer } from "routing-controllers";
// import { createConnection } from 'typeorm';

// const app = createExpressServer({
//     controllers: [
//         path.join(__dirname, '/modules/**/controllers/*{.js,.ts}')
//     ]
// })

// app.listen(3000, () => {
//     createConnection()
//         .then(async connection => {
//             console.log('App Express Server listening on port : 3000')
//         })
//         .catch(error => console.log("Error: ", error));
// })

import './shared/infra/SingletonRegister'
import * as cluster from 'cluster';
import * as os from 'os';
import Container from 'typedi';
import { IS_DEVELOPMENT } from "./shared/configs/Configuration";
import { DbContext } from './shared/infra/databases/DbContext';
import { IDbContext } from './shared/infra/databases/interfaces/IDbContext';
// import { IDbContext } from './shared/infra/databases/interfaces/IDbContext';

const dbContext = Container.get<IDbContext>('db.context');

const startApplication = async () => {
    console.log('Starting application')
};

const runMigrations = async () => {
    console.log(('Run migrations...'))
    const conn = dbContext.getConnection();
    const migrations = await conn.runMigrations();
    if (!migrations.length)
        console.log('Not found new migration.')
    migrations.forEach(migration => console.log('Migrated: \x1b[32m' + migration.name + '\x1b[0m\n'));
};

if (IS_DEVELOPMENT) {
    // logService.info('Starting project \x1b[1m\x1b[96m' + PROJECT_NAME + '\x1b[0m\x1b[21m with \x1b[32mdevelopment\x1b[0m mode...');

    startApplication().then(async () => {
        await runMigrations();
    });
}
else {
    if (cluster.isMaster) {
        const numCPUs = os.cpus().length;
        // Fork workers.
        for (let i = 0; i < numCPUs; i++)
            cluster.fork();

        cluster.on('exit', worker => {
            cluster.fork();
            console.log(`Worker ${worker.process.pid} is died.`)
        });
        console.log(`Master ${process.pid} is started.`);
    }
    else {
        startApplication().then(() => {
            console.log(`Worker ${process.pid} is started.`);
        }).catch((error: Error) => {
            console.log(error.stack || error.message);
            dbContext.destroyConnection();
            setTimeout(() => process.exit(), 2000);
        });
    }
}
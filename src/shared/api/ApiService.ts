import { Server } from 'http';
import * as path from 'path';
import * as compression from 'compression';
import * as express from 'express';
import { RoutingControllersOptions } from 'routing-controllers';
import { Container } from 'typedi';
import { API_PORT, IS_DEVELOPMENT } from '../configs/Configuration';
import { ApiAuthenticator } from './ApiAuthenticator';
import { HttpServer } from './HttpServer';

export class ApiService {
    setup(callback: any = null): Server {
        const authenticator = Container.get(ApiAuthenticator);
        const app = express();

        app.get('/healthz', (_req, res) => {
            res.status(200).end('ok');
        });

        app.use(compression({ filter: (req, res) => req.headers['x-no-compression'] ? false : compression.filter(req, res) }));

        const options: RoutingControllersOptions = {
            cors: {
                origin: '*',
                methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
                allowedHeaders: ['Origin', 'Content-Type', 'Accept', 'Authorization'],
                maxAge: 3600,
                preflightContinue: true,
                optionsSuccessStatus: 204
            },
            routePrefix: '/api',
            controllers: [
                // path.join(__dirname, './controllers/**/*{.js,.ts}')
                path.join(__dirname, '../../modules/**/*{.js,.ts}')
            ],
            middlewares: [
                path.join(__dirname, '../middlewares/ErrorMiddleware.ts')
            ],
            // interceptors: [
            //     path.join(__dirname, './interceptors/*{.js,.ts}')
            // ],
            validation: false,
            defaultErrorHandler: false,
            development: IS_DEVELOPMENT,
            authorizationChecker: authenticator.authorizationHttpChecker,
            currentUserChecker: authenticator.userAuthChecker
        };

        const httpServer = new HttpServer();
        httpServer.createApp(options, app);

        return httpServer.start(API_PORT, callback);
    }
}

import { InternalServerError } from './../exceptions/InternalServerError';
import { Response } from 'express';
import { ExpressErrorMiddlewareInterface, Middleware } from 'routing-controllers';
import { AccessDeniedError } from '../exceptions/AccessDeniedError';
import { SystemError } from '../exceptions/SystemError';

@Middleware({ type: 'after' })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
    error(err: SystemError, req: any, res: Response) {
        // Handle internal server error.
        if (!err.code || !err.httpCode) {
            err = new InternalServerError();
        }
        else {
            if (err.httpCode === 403)
                err = new AccessDeniedError();
        }

        res.status(err.httpCode);
        res.send({
            code: err.code,
            message: err.message
        });
    }
}

// import { Result } from './../../../../shared/core/Result';
// import { GetUserAuthByJwtQuery } from './GetUserAuthByJwtQuery';
// import * as validator from 'class-validator'
// import { Inject, Service } from 'typedi'
// import { IUseCaseQueryCQRS } from '../../../../shared/core/IUseCase'
// import { UserAuthenticated } from '../../../user/domain/UserAuthenticated';
// import { UnauthorizedError } from '../../../../shared/exceptions/UnauthorizedError';
// import { MessageError } from '../../../../shared/exceptions/message/MessageError';
// import { RedisAuthService } from '../../../../shared/services/auth/RedisAuthService';

// @Service()
// export class GetUserAuthByJwtUseCase implements IUseCaseQueryCQRS<GetUserAuthByJwtQuery, UserAuthenticated> {
//     private readonly _redisAuthService: RedisAuthService;
//     constructor() {
//         this._redisAuthService = new RedisAuthService()
//     }

//     async handler(param: GetUserAuthByJwtQuery): Promise<any> {
//         const { token, roleIds } = param
//         if (!token)
//             throw new UnauthorizedError(MessageError.PARAM_REQUIRED, 'token')
//         if (!validator.isJWT(token))
//             throw new UnauthorizedError(MessageError.PARAM_INVALID, 'token');
//         let payload;
//         try {
//             payload = this._redisAuthService.verify(param.token);
//         }
//         catch (error) {
//             if (error.name === 'TokenExpiredError')
//                 throw new UnauthorizedError(MessageError.PARAM_EXPIRED, 'token');
//             else
//                 throw new UnauthorizedError(MessageError.PARAM_INVALID, 'token');
//         }
//     }
// }
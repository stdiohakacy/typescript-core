import { Action } from 'routing-controllers';
import { Service } from 'typedi';
import { UnauthorizedError } from '../exceptions/UnauthorizedError';
import { MessageError } from '../exceptions/message/MessageError';
import { UserAuthenticated } from '../../modules/user/domain/UserAuthenticated';
import { IJwtPayloadExtend, RedisAuthService } from '../services/auth/RedisAuthService';

@Service()
export class ApiAuthenticator {
    private readonly _redisAuthService: RedisAuthService
    constructor() {
        this._redisAuthService = new RedisAuthService()
    }

    authorizationHttpChecker = async (action: Action, roleIds: string[]): Promise<boolean> => {
        const parts = (action.request.headers.authorization || '').split(' ');
        const token = parts.length === 2 && parts[0] === 'Bearer' ? parts[1] : '';

        let tokenDecoded: IJwtPayloadExtend

        try {
            tokenDecoded = this._redisAuthService.decodeJWT(token)
        }
        catch (error) {
            if (error.name === 'TokenExpiredError')
                throw new UnauthorizedError(MessageError.PARAM_EXPIRED, 'token')
            else
                throw new UnauthorizedError(MessageError.PARAM_INVALID, 'token')
        }

        if (!tokenDecoded || !tokenDecoded.sub)
            throw new UnauthorizedError(MessageError.PARAM_INVALID, 'token')

        const { email } = tokenDecoded

        const tokens = await this._redisAuthService.getTokens(email)
        if (tokens.length > 0) {
            const userAuthenticated = new UserAuthenticated(token, tokenDecoded.sub)
            action.request.userAuth = userAuthenticated
        }

        return !!action.request.userAuth;
    }

    userAuthChecker = (action: Action) => {
        return action.request.userAuth;
    }
}

import { GenderType } from './../../enums/GenderType';
import { Result } from "../../../../shared/core/Result";
import { AggregateRoot } from "../../../../shared/domain/AggregateRoot";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";
import { UserStatus } from "../../enums/UserStatus";
import { UserId } from '../entities/UserId';
import { UserCreated } from '../events/UserCreated';
import { UserEmail } from '../valueObjects/UserEmail';
import { hashMD5 } from '../../../../shared/libs/crypt';
import { JWTToken, RefreshToken } from '../../../../shared/services/auth/TokenAlias';

interface IUserProps {
    firstName: string;
    email: UserEmail;
    password: string;
    status?: UserStatus;
    lastName?: string;
    avatar?: string;
    gender?: GenderType;
    birthday?: string;
    phone?: string;
    address?: string;
    culture?: string;
    currency?: string;
    activeKey?: string;
    activeExpire?: Date;
    activedAt?: Date;
    archivedAt?: Date;

    accessToken?: JWTToken
    refreshToken?: RefreshToken
}

export class User extends AggregateRoot<IUserProps> {
    get userId(): UserId {
        return UserId.create(this._id).getValue();
    }

    get status(): UserStatus {
        return this.props.status
    }

    get firstName(): string {
        return this.props.firstName
    }

    get lastName(): string {
        return this.props.lastName
    }

    get email(): UserEmail {
        return this.props.email
    }

    get password(): string {
        return this.props.password
    }

    get avatar(): string {
        return this.props.avatar
    }

    get gender(): GenderType {
        return this.props.gender
    }

    get birthday(): string {
        return this.props.birthday
    }

    get phone(): string {
        return this.props.phone
    }

    get address(): string {
        return this.props.address
    }

    get culture(): string {
        return this.props.culture
    }

    get currency(): string {
        return this.props.currency
    }

    get activeKey(): string {
        return this.props.activeKey
    }

    get activeExpire(): Date | null {
        return this.props.activeExpire
    }

    get activedAt(): Date | null {
        return this.props.activedAt
    }

    get archivedAt(): Date | null {
        return this.props.archivedAt
    }

    get accessToken(): JWTToken {
        return this.props.accessToken
    }

    get refreshToken(): RefreshToken {
        return this.props.refreshToken
    }

    public static create(props: IUserProps, id?: UniqueEntityId): Result<User> {
        const user = new User({ ...props }, id)

        const isNew = !!user === false

        if (isNew)
            user.addDomainEvent(new UserCreated(user))
        return Result.OK(user)
    }

    /* Handlers */

    public hashPassword(password: string): string {
        return hashMD5(password, '$$');
    }

    public comparePassword(password: string): boolean {
        return this.password === this.hashPassword(password);
    }

    public setToken(accessToken: JWTToken, refreshToken: RefreshToken): void {
        this.props.accessToken = accessToken
        this.props.refreshToken = refreshToken
        // this.addDomainEvent(new UserLoggedIn(this))
    }

    public isLogin(): boolean {
        return !!this.props.accessToken && !!this.props.refreshToken
    }
}
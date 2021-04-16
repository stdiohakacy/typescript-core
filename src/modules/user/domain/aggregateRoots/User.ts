import { GenderType } from './../../enums/GenderType';
import { Result } from "../../../../shared/core/Result";
import { AggregateRoot } from "../../../../shared/domain/AggregateRoot";
import { UniqueEntityId } from "../../../../shared/domain/UniqueEntityId";
import { UserStatus } from "../../enums/UserStatus";
import { UserId } from '../entities/UserId';
import { UserCreated } from '../events/UserCreated';

interface IUserProps {
    status: UserStatus;
    firstName: string;
    lastName: string | null;
    email: string;
    avatar: string | null;
    gender: GenderType | null;
    birthday: string | null;
    phone: string | null;
    address: string | null;
    culture: string | null;
    currency: string | null;
    activeKey: string | null;
    activeExpire: Date | null;
    activedAt: Date | null;
    archivedAt: Date | null;
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

    get email(): string {
        return this.props.email
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

    get activedAt(): Date | null{
        return this.props.activedAt
    }

    get archivedAt(): Date | null{
        return this.props.archivedAt
    }

    public static create(props: IUserProps, id?: UniqueEntityId): Result<User> {
        const user = new User({...props}, id)

        const isNew = !!user === false

        if(isNew)
            user.addDomainEvent(new UserCreated(user))
        return Result.OK(user)
    }
}
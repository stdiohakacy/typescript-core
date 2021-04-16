import { GenderType } from './../../../../../modules/user/enums/GenderType';
import { UserStatus } from './../../../../../modules/user/enums/UserStatus';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../../../modules/user/domain/aggregateRoots/User';
import { BaseEntityDb } from './BaseEntityDb';
import { ChannelUserDb } from './ChannelUserDb';
import { UniqueEntityId } from '../../../../domain/UniqueEntityId';
import { MessageDb } from './MessageDb';
import { UserEmail } from '../../../../../modules/user/domain/valueObjects/UserEmail';

@Entity('user')
export class UserDb extends BaseEntityDb<User> {
    @PrimaryGeneratedColumn('uuid', { name: 'id' })
    id: string;

    @Column('enum', { name: 'status', enum: UserStatus, default: UserStatus.ACTIVED })
    status: UserStatus;

    @Column('varchar', { name: 'first_name', length: 20 })
    firstName: string;

    @Column('varchar', { name: 'last_name', length: 20, nullable: true })
    lastName: string | null;

    @Column('varchar', { name: 'email', length: 120 })
    email: string;

    @Column('varchar', { name: 'password', length: 32, nullable: false })
    password: string;

    @Column('varchar', { name: 'avatar', length: 200, nullable: true })
    avatar: string | null;

    @Column('enum', { name: 'gender', enum: GenderType, nullable: true })
    gender: GenderType | null;

    @Column('date', { name: 'birthday', nullable: true })
    birthday: string | null;

    @Column('varchar', { name: 'phone', length: 20, nullable: true })
    phone: string | null;

    @Column('varchar', { name: 'address', length: 200, nullable: true })
    address: string | null;

    @Column('varchar', { name: 'culture', length: 5, nullable: true })
    culture: string | null;

    @Column('varchar', { name: 'currency', length: 3, nullable: true })
    currency: string | null;

    @Column('varchar', { name: 'activeKey', length: 64, nullable: true })
    activeKey: string | null;

    @Column('timestamptz', { name: 'activeExpire', nullable: true })
    activeExpire: Date | null;

    @Column('timestamptz', { name: 'activedAt', nullable: true })
    activedAt: Date | null;

    @Column('timestamptz', { name: 'archivedAt', nullable: true })
    archivedAt: Date | null;

    /* Relationship */
    @OneToMany(() => ChannelUserDb, channelUsers => channelUsers.user)
    channelUsers: ChannelUserDb[];

    @OneToMany(() => MessageDb, messages => messages.user)
    messages: MessageDb[];

    /* Handlers */
    toEntity(): User {
        const userOrError = User.create({
            firstName: this.firstName,
            lastName: this.lastName,
            password: this.password,
            email: this.email ? UserEmail.create({ value: this.email }).getValue() : null,
            avatar: this.avatar,
            gender: this.gender,
            birthday: this.birthday,
            phone: this.phone,
            address: this.address,
            culture: this.culture,
            currency: this.currency,
            activeKey: this.activeKey,
            activeExpire: this.activeExpire,
            activedAt: this.activedAt,
            archivedAt: this.archivedAt
        }, new UniqueEntityId(this.id))
        return userOrError.isSuccess ? userOrError.getValue() : null
    }

    fromEntity(user: User): UserDb {
        if (user.firstName)
            this.firstName = user.firstName
        if (user.lastName)
            this.lastName = user.lastName
        if (user.password)
            this.password = user.hashPassword(user.password)
        if (user.email)
            this.email = user.email.value
        if (user.avatar)
            this.avatar = user.avatar
        if (user.gender)
            this.gender = user.gender
        if (user.birthday)
            this.birthday = user.birthday
        if (user.phone)
            this.phone = user.phone
        if (user.address)
            this.address = user.address
        if (user.culture)
            this.culture = user.culture
        if (user.currency)
            this.currency = user.currency
        if (user.activeKey)
            this.activeKey = user.activeKey
        if (user.activeExpire)
            this.activeExpire = user.activeExpire
        if (user.activedAt)
            this.activedAt = user.activedAt
        if (user.archivedAt)
            this.archivedAt = user.archivedAt
        return this
    }
}

import { Injectable } from '@nestjs/common';
import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryColumn,
    Repository,
} from 'typeorm';

export enum UserSituation {
    None = 0,
    Banned = 1 << 1,
    UnableToComment = 2 << 1,
    UnableToCreateGame = 3 << 1,
    UnableToReadComments = 4 << 1,
    UnableToPlayGames = 5 << 1,
    NotVerified = 6 << 1,
}

export enum Role {
    User = 'User',
    Admin = 'Admin',
}

@Entity()
export class User {
    @PrimaryColumn()
    id: string;

    @Column()
    birth_date?: Date;

    @Column({
        unique: true,
        transformer: {
            to(value) {
                return value.toLowerCase();
            },
            from(value) {
                return value;
            },
        },
    })
    username?: string;

    @Column({ unique: true })
    email?: string;

    @Column()
    password?: string;

    @Column({ default: 'default.png' })
    avatar?: string;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.User,
    })
    role?: Role;

    @Column({
        type: 'enum',
        enum: UserSituation,
        default: UserSituation.NotVerified,
    })
    situation?: UserSituation;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;
}

@Injectable()
export class UserRepository extends Repository<User> {}

import { Injectable } from '@nestjs/common';
import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    PrimaryColumn,
    Repository,
} from 'typeorm';

export enum Role {
    User = 'user',
    Admin = 'admin',
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

    @Column({ default: false })
    verified?: boolean;

    @Column({
        type: 'enum',
        enum: Role,
        default: Role.User,
    })
    role?: Role;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;
}

@Injectable()
export class UserRepository extends Repository<User> {}

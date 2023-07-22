import { Injectable } from '@nestjs/common';
import {
    AfterLoad,
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    Repository,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class ResetPassword {
    @PrimaryColumn()
    id: string;

    @Column()
    token: string;

    @Column({ name: 'user_id' })
    user_id: string;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user?: User;

    @Column()
    used: boolean;

    @Column()
    expires_at: Date;

    @BeforeInsert()
    setExpirationTime() {
        const expirationTime = new Date();
        expirationTime.setHours(expirationTime.getMinutes() + 30);
        this.expires_at = expirationTime;
    }

    @AfterLoad()
    checkExpirationTime() {
        if (
            this.expires_at &&
            this.expires_at.getTime() < new Date().getTime()
        ) {
            this.is_expired = true;
        }
    }

    is_expired: boolean;
}

@Injectable()
export class ResetPasswordRepository extends Repository<ResetPassword> {}

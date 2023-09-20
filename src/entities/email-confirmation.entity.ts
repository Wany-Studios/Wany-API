import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    Repository,
    UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { Injectable } from '@nestjs/common';

@Entity({ name: 'email_confirmation' })
export class EmailConfirmationEntity {
    @PrimaryColumn()
    id: string;

    @Column({ name: 'user_id' })
    user_id: string;

    @ManyToOne(() => UserEntity, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user?: UserEntity;

    @Column()
    email: string;

    @Column()
    used: boolean;

    @Column()
    token: string;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;
}

@Injectable()
export class EmailConfirmationRepository extends Repository<EmailConfirmationEntity> {}

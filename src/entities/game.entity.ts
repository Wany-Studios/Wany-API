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
import environment from '../environment';
import { Genre } from '../modules/models/genre';
import { Game } from '../modules/models/game';

@Entity('game')
export class GameEntity {
    @PrimaryColumn()
    id: string;

    @Column({ name: 'user_id' })
    user_id: string;

    @ManyToOne(() => UserEntity, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    private user?: UserEntity;

    @Column({
        type: environment.isTesting ? 'text' : 'enum',
        enum: Genre,
    })
    genre: string;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    game_path: string;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;
}

@Injectable()
export class GameRepository extends Repository<GameEntity> {}

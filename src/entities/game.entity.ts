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
import { User } from './user.entity';
import { Injectable } from '@nestjs/common';
import environment from '../environment';

export enum Genre {
    Action = 'Action',
    Terror = 'Terror',
    Horror = 'Horror',
    Adventure = 'Adventure',
}

@Entity()
export class Game {
    @PrimaryColumn()
    id: string;

    @Column({ name: 'user_id' })
    user_id: string;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    private user?: User;

    @Column({
        type: environment.isTesting ? 'text' : 'enum',
        enum: Genre,
    })
    genre: Genre;

    @Column()
    description: string;

    @CreateDateColumn()
    created_at?: Date;

    @UpdateDateColumn()
    updated_at?: Date;

    constructor(
        id: string,
        userId: string,
        genre: Genre,
        description: string,
        created_at?: Date,
        updated_at?: Date,
    ) {
        this.id = id;
        this.user_id = userId;
        this.genre = genre;
        this.description = description;
        this.created_at = created_at ?? new Date();
        this.updated_at = updated_at;
    }
}

@Injectable()
export class GameRepository extends Repository<Game> {}

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
import { Injectable } from '@nestjs/common';
import { Genre } from '../modules/models/genre';
import environment from '../environment';

@Entity({ name: 'game' })
export class GameEntity {
    @PrimaryColumn()
    id: string;

    @Column({ name: 'game_id' })
    game_id: string;

    @ManyToOne(() => GameEntity, { nullable: false })
    @JoinColumn({ name: 'game_id' })
    private game?: GameEntity;

    @Column({
        name: 'image_path',
    })
    image_path: string;

    @Column({ name: 'cover' })
    cover: boolean;

    @CreateDateColumn()
    created_at?: Date;
}

@Injectable()
export class GameRepository extends Repository<GameEntity> {}

import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    Repository,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { GameEntity } from './game.entity';

@Entity({ name: 'game_image' })
export class GameImageEntity {
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
export class GameImageRepository extends Repository<GameImageEntity> {}

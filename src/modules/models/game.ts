import { randomUUID } from 'crypto';
import { Genre } from './genre';

interface Props {
    genre: Genre;
    title: string;
    description: string;
    gamePath: string;
    imageIDs: string[];
    createdAt: Date;
    updatedAt?: Date;
    userId: string;
}

export class Game {
    private readonly props: Props;
    public readonly id: string;

    constructor(
        props: {
            genre: Genre;
            title: string;
            description: string;
            createdAt?: Date;
            updatedAt?: Date;
            userId: string;
            imageIDs?: string[];
            gamePath: string;
        },
        id?: string,
    ) {
        this.props = {
            ...props,
            imageIDs: props.imageIDs || [],
            createdAt: props.createdAt || new Date(),
        };
        this.id = id || randomUUID();
    }

    get userId(): string {
        return this.props.userId;
    }

    get genre(): Genre {
        return this.props.genre;
    }
    set genre(genre: Genre) {
        this.updated();
        this.props.genre = genre;
    }

    get title() {
        return this.props.title;
    }
    set title(value: string) {
        this.updated();
        this.props.title = value;
    }

    get description(): string {
        return this.props.description;
    }
    set description(value: string) {
        this.updated();
        this.props.description = value;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date | undefined {
        return this.props.updatedAt;
    }

    get imageIDs() {
        return this.props.imageIDs;
    }
    set imageIDs(paths: string[]) {
        this.props.imageIDs = paths;
    }

    get gamePath() {
        return this.props.gamePath;
    }
    private updated() {
        this.props.updatedAt = new Date();
    }
}

import { randomUUID } from 'crypto';

interface Props {
    cover: boolean;
    imagePath: string;
    gameId: string;
    createdAt: Date;
    updatedAt?: Date;
}

export class GameImage {
    private readonly props: Props;
    public readonly id: string;

    constructor(
        props: {
            gameId: string;
            imagePath: string;
            cover: boolean;
            updatedAt?: Date;
            createdAt?: Date;
        },
        id?: string,
    ) {
        this.props = {
            ...props,
            createdAt: props.createdAt || new Date(),
        };
        this.id = id || randomUUID();
    }

    get gameId() {
        return this.props.gameId;
    }
    set gameId(value: string) {
        this.updated();
        this.props.gameId = value;
    }

    get imagePath() {
        return this.props.imagePath;
    }
    set imagePath(value: string) {
        this.updated();
        this.props.imagePath = value;
    }

    get cover() {
        return this.props.cover;
    }
    set cover(value: boolean) {
        this.updated();
        this.props.cover = value;
    }

    get createdAt(): Date {
        return this.props.createdAt;
    }

    get updatedAt(): Date | undefined {
        return this.props.updatedAt;
    }

    private updated() {
        this.props.updatedAt = new Date();
    }
}

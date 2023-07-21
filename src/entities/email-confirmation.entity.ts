import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, Repository, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Injectable } from "@nestjs/common";

@Entity()
export class EmailConfirmation {
    @PrimaryColumn()
    id: string;

    @Column({ name: 'user_id' })
    user_id: string;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'user_id' })
    user?: User;

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
export class EmailConfirmationRepository extends Repository<EmailConfirmation> { }

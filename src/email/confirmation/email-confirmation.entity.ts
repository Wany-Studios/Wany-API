import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, Repository, UpdateDateColumn } from "typeorm";
import { User } from "../../user/user.entity";
import { Injectable } from "@nestjs/common";

@Entity()
export class EmailConfirmation {
    @PrimaryColumn()
    id: string;

    @ManyToOne(type => User)
    @JoinColumn()
    user_id: string;

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

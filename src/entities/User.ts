import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne} from "typeorm";
import { IsEmail } from 'class-validator';
import { Exclude } from 'class-transformer';
import Permission from "./Permission";

@Entity('users')
class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false, unique: true })
    login: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ nullable: false })
    @IsEmail()
    email: string;

    @Column({ name: 'password_reset_expiration' })
    @Exclude()
    passwordResetExpiration: Date; 

    @Exclude()
    @Column({ name: 'password_reset_token' })
    passwordResetToken: string;

    @Exclude()
    @Column({ name: 'is_activated', default: 0 })
    isActivated: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(type => Permission)
    @JoinColumn({ name: 'permission_id' })
    permission: Permission;

}

export default User;

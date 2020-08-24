import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn, ManyToOne} from "typeorm";
import { IsEmail } from 'class-validator';
import Profile from "./Profile";

@Entity('users')
class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false, unique: true })
    login: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false })
    @IsEmail()
    email: string;

    @Column({ name: 'password_reset_expiration' })
    passwordResetExpiration: Date; 

    @Column({ name: 'password_reset_token' })
    passwordResetToken: string;

    @Column({ name: 'is_activated', default: 0 })
    isActivated: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(type => Profile)
    @JoinColumn({ name: 'profile_id' })
    profile: Profile;

}

export default User;

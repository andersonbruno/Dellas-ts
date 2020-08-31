import { getCustomRepository } from 'typeorm';
import UserRepository from "../repositories/UserRepository";
import PermissionRepository from "../repositories/PermissionRepository";
import User from "../entities/User";
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import { classToClass } from 'class-transformer';

export default class CreateUserService {
    private userRepository: UserRepository;

    constructor(repository: UserRepository){
        this.userRepository = repository;
    }

    public async execute({email, login, name, password}: User){
        
        const user = await this.userRepository.findByLogin(login);
        
        //if user exists, return the user from the db
        if(user){
            throw new Error('User already registered');
        }

        //get default permission
        const permission = await getCustomRepository(PermissionRepository).findByName('Default');
        
        //generate token to activate user account
        const token = crypto.randomBytes(20).toString('hex');

        //genarete the expiration time to activate the account
        const now = new Date();
        now.setHours(now.getHours() + 2);

        const hash = await bcryptjs.hash(password, 10);

        const newUser = await this.userRepository.save({
            login,
            password: hash,
            name,
            email,
            permission,
            passwordResetToken: token,
            passwordResetExpiration: now,
        });

        return classToClass(newUser);
    }
}
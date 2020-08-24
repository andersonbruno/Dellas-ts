import { getCustomRepository } from 'typeorm';
import UserRepository from "../repositories/UserRepository";
import ProfileRepository from "../repositories/ProfileRepository";
import User from "../models/User";
import Profile from "../models/Profile";
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

export default class CreateUserService {
    private userRepository: UserRepository;

    constructor(repository: UserRepository){
        this.userRepository = repository;
    }

    public async execute({email, login, name, password}: User){
        
        const users = await this.userRepository.findByLogin(login);
        
        //if user exists, return the user from the db
        if(users){
            return users;
        }

        //get default profile
        const profile = await getCustomRepository(ProfileRepository).findByName('Default');
        
        //generate token to activate user account
        const token = crypto.randomBytes(20).toString('hex');

        //genarete the expiration time to activate the account
        const now = new Date();
        now.setHours(now.getHours() + 2);

        const hash = await bcryptjs.hash(password, 10);

        const user = await this.userRepository.save({
            login,
            password: hash,
            name,
            email,
            profile,
            passwordResetToken: token,
            passwordResetExpiration: now,
        });

        return user;
    }
}
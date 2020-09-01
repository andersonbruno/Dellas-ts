import UserRepository from "../repositories/UserRepository";
import { getCustomRepository } from 'typeorm';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { classToClass } from 'class-transformer';

import authConfig from '../config/auth.json';

export default class AuthenticateUserService {
    private userRepository: UserRepository;

    constructor(repository: UserRepository){
        this.userRepository = repository;
    }

    public async execute(login: string, password: string){
        const repository = getCustomRepository(UserRepository);

        const user = await repository.findByLogin(login);

        if(!user){
            throw new Error('User not found');
        }

        if(!await bcryptjs.compare(password, user.password)){
            throw new Error('Invalid password');
        }

        const token = jwt.sign({ id: user.id }, authConfig.secret, {
            expiresIn: 86400,
        });

        return { user: classToClass(user), token};
    }
}
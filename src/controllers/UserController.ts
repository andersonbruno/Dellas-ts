import { Request, Response } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';
import CreateUserService from '../services/CreateUserService';
import UserRepository from '../repositories/UserRepository';
import User from '../entities/User';

export default {

    async store(req: Request, res: Response){
        try{
            const repo = getCustomRepository(UserRepository);
            const service = new CreateUserService(repo);
            const user = await service.execute(req.body);
            res.status(201).json(user);
        } catch ( err ) {
            res.status(400).json({ message: err.message });
        }
    },

    async index(req: Request, res: Response){
        res.json(await getRepository(User).find());
    }

}
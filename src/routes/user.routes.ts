import { Router } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';
import CreateUserService from '../services/CreateUserService';
import UserRepository from '../repositories/UserRepository';
import Profile from '../models/Profile';

const userRouter = Router();

userRouter.post('/', async (req, res) => {
    try{
        const repo = getCustomRepository(UserRepository);
        const service = new CreateUserService(repo);
        const profile = await service.execute(req.body);
        return res.status(201).json(profile);
    } catch ( err ) {
        return res.status(400).json({ message: err.message });
    }
});

userRouter.get('/', async (req, res) => {
    res.json(await getRepository(Profile).find());
});

export default userRouter;

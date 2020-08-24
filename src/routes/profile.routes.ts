import { Router } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';
import CreateProfileService from '../services/CreateProfileService';
import ProfileRepository from '../repositories/ProfileRepository';
import Profile from '../models/Profile';

const profileRouter = Router();

profileRouter.post('/', async (req, res) => {
    try{
        const repo = getCustomRepository(ProfileRepository);
        const service = new CreateProfileService(repo);
        const profile = await service.execute(req.body.name);
        return res.status(201).json(profile);
    } catch ( err ) {
        return res.status(400).json({ message: err.message });
    }
});

profileRouter.get('/', async (req, res) => {
    res.json(await getRepository(Profile).find());
});

export default profileRouter;

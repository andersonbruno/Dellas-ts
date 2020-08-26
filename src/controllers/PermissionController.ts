import { Request, Response } from 'express';
import { getRepository, getCustomRepository } from 'typeorm';
import CreatePermissionService from '../services/CreatePermissionService';
import PermissionRepository from '../repositories/PermissionRepository';
import Permission from '../entities/Permission';

export default {

    async store(req: Request, res: Response){
        try{
            const repo = getCustomRepository(PermissionRepository);
            const service = new CreatePermissionService(repo);
            const permission = await service.execute(req.body.name);
            res.status(201).json(permission);
        } catch ( err ) {
            res.status(400).json({ message: err.message });
        }
    },

    async index(req: Request, res: Response){
        res.json(await getRepository(Permission).find());
    }

}
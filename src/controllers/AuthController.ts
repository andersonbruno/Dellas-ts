import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../repositories/UserRepository';
import AuthenticateUserService from '../services/AuthenticateUserService';
import ForgotPasswordService from '../services/ForgotPasswordService';
import ResetPasswordService from '../services/ResetPasswordService';
import ActiveUserService from '../services/ActivateUserService';

export default {

    async authenticate(req: Request, res: Response) {
        const { login, password } = req.body;

        try{
            const repository = getCustomRepository(UserRepository);
            const service = new AuthenticateUserService(repository);
            const permission = await service.execute(login, password);
            res.status(200).json(permission);
        } catch ( err ) {
            res.status(400).json({ message: err.message });
        }
    },

    async forgotPassword(req: Request, res: Response) {
        const { email } = req.body;

        try{
            const repository = getCustomRepository(UserRepository);
            const service = new ForgotPasswordService(repository);
            await service.execute(email);
            res.send();
        } catch (err) {
            console.log(err);

            res.status(400).send({ error: 'Erro on forgot password, try again'});
        }
    },

    async resetPassword(req: Request, res: Response) {
        const { login, token, password } = req.body;

        try{
            const repository = getCustomRepository(UserRepository);
            const service = new ResetPasswordService(repository);
            await service.execute(login, token, password);
            res.send();
        } catch (err) { 
            res.status(400).send({ error: 'Cannot reset password, try again'});
        }
    },

    async activeUser(req: Request, res: Response){
        const { login, token } = req.body;
    
        try{
            const repository = getCustomRepository(UserRepository);
            const service = new ActiveUserService(repository);
            await service.execute(login, token);
            res.send();
        } catch (err) { 
            res.status(400).send({ message: err.message });
        }
    }

}
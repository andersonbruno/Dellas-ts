import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../repositories/UserRepository';
import AuthenticateUserService from '../services/AuthenticateUserService';
import ForgotPasswordService from '../services/ForgotPasswordService';
import ResetPasswordService from '../services/ResetPasswordService';

export default {

    async authenticate(req: Request, res: Response) {
        const { login, password } = req.body;

        try{
            const repo = getCustomRepository(UserRepository);
            const service = new AuthenticateUserService(repo);
            const permission = await service.execute(login, password);
            res.status(200).json(permission);
        } catch ( err ) {
            res.status(400).json({ message: err.message });
        }
    },

    async forgotPassword(req: Request, res: Response) {
        const { email } = req.body;

        try{
            const service = new ForgotPasswordService();
            service.execute(email);
            res.send();
        } catch (err) {
            console.log(err);

            res.status(400).send({ error: 'Erro on forgot password, try again'});
        }
    },

    async resetPassword(req: Request, res: Response) {
        const { login, token, password } = req.body;

        try{
            const service = new ResetPasswordService();
            service.execute(login, token, password);

            res.send();
        } catch (err) { 
            res.status(400).send({ error: 'Cannot reset password, try again'});
        }
    }

}
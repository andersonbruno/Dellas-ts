import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../repositories/UserRepository';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import authConfig from '../config/auth.json';
import { classToClass } from 'class-transformer';
import Mailer from '../modules/mailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { IS_BTC_ADDRESS } from 'class-validator';

export default {

    async authenticate(req: Request, res: Response) {
        const { login, password } = req.body;

        const repository = getCustomRepository(UserRepository);

        let user = await repository.findByLogin(login);

        if(!user){
            return res.status(400).send({ error: 'User not found'});
        }

        if(!await bcryptjs.compare(password, user.password)){
            return res.status(400).send({ error: 'Invalid password'});
        }

        const token = jwt.sign({ id: user.id }, authConfig.secret, {
            expiresIn: 86400,
        });

        res.send({ user: classToClass(user), token});
    },

    async forgotPassword(req: Request, res: Response) {
        const { email } = req.body;

        try{
            const repository = getCustomRepository(UserRepository);

            const user = await repository.findByEmail(email);

            if(!user){
                return res.status(400).send({ error: 'User not found'});
            }

            const token = crypto.randomBytes(20).toString('hex');

            const now = new Date();
            now.setHours(now.getHours() + 1);

            user.passwordResetToken = token;
            user.passwordResetExpiration = now;

            await repository.save(user);

            console.log(token);
            
            const mailer = new Mailer();

            //get template file

            const templateFileContent = await fs.promises.readFile(path.resolve(__dirname, '../resources/mail/auth/forgot_password.html'), {
                encoding: 'utf-8',
            });
          
            let firstName = '';

            if(user.name.includes(" ")){
                firstName = user.name.split(" ")[0];
            }else{
                firstName = user.name;
            }

            const name = user.name;

            const parseTemplate = handlebars.compile(templateFileContent);
        
            const template = parseTemplate({ name: firstName, token: user.passwordResetToken });

            mailer.sendMail({name: name,address: email},'Redefinição de senha',template);

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

            const user = await repository.findByLogin(login);

            if(!user){
                return res.status(400).send({ error: 'User not found'});
            }

            if(token !== user.passwordResetToken){
                return res.status(400).send({ error: 'Token invalid'});
            }

            const now = new Date();

            if( now > user.passwordResetExpiration){
                return res.status(400).send({ error: 'Token expired, generate a new one'});
            }

            const hash = await bcryptjs.hash(password, 10);

            user.password = hash;

            await repository.save(user);

            res.send();
        } catch (err) { 
            res.status(400).send({ error: 'Cannot reset password, try again'});
        }
    }

}
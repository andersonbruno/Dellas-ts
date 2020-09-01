import UserRepository from "../repositories/UserRepository";
import { getCustomRepository } from 'typeorm';
import Mailer from '../modules/mailer';
import handlebars from 'handlebars';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

export default class ForgotPasswordService {
    private userRepository: UserRepository;

    public async execute(email: string){
        const repository = getCustomRepository(UserRepository);

            const user = await repository.findByEmail(email);

            if(!user){
                throw new Error('User not found');
            }

            const token = crypto.randomBytes(20).toString('hex');

            const now = new Date();
            now.setHours(now.getHours() + 1);

            user.passwordResetToken = token;
            user.passwordResetExpiration = now;

            await repository.save(user);
            
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
    }
}
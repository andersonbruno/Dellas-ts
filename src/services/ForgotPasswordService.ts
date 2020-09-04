import UserRepository from "../repositories/UserRepository";
import Mailer from '../modules/mailer';
import handlebars from 'handlebars';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';

export default class ForgotPasswordService {

    private userRepository: UserRepository;

    constructor(repository: UserRepository){
        this.userRepository = repository;
    }

    public async execute(email: string){
        const user = await this.userRepository.findByEmail(email);

        if(!user){
            throw new Error('User not found');
        }

        const token = crypto.randomBytes(20).toString('hex');

        const now = new Date();
        now.setHours(now.getHours() + 1);

        user.passwordResetToken = token;
        user.passwordResetExpiration = now;

        await this.userRepository.save(user);
        
        const mailer = new Mailer();

        //get template file

        const templateFileContent = await fs.promises.readFile(path.resolve(__dirname, '../resources/mail/auth/forgot_password.html'), {
            encoding: 'utf-8',
        });
        
        const firstName = user.name.includes(" ") ? user.name.split(" ")[0] : user.name;

        const name = user.name;

        const parseTemplate = handlebars.compile(templateFileContent);
    
        const template = parseTemplate({ name: firstName, token: user.passwordResetToken });

        mailer.sendMail({name: name,address: email},'Redefinição de senha',template);

        return { mailSent: true};
    }
}
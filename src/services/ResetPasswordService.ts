import UserRepository from "../repositories/UserRepository";
import { getCustomRepository } from 'typeorm';
import bcryptjs from 'bcryptjs';

export default class ResetPasswordService {
    private userRepository: UserRepository;

    public async execute(login: string, token: string, password: string){
        const repository = getCustomRepository(UserRepository);

        const user = await repository.findByLogin(login);

        if(!user){
            throw new Error('User not found');
        }

        if(token !== user.passwordResetToken){
            throw new Error('Token invalid');
        }

        const now = new Date();

        if( now > user.passwordResetExpiration){
            throw new Error('Token expired, generate a new one');
        }

        const hash = await bcryptjs.hash(password, 10);

        user.password = hash;

        await repository.save(user);
    }
}
import UserRepository from "../repositories/UserRepository";
import bcryptjs from 'bcryptjs';

export default class ResetPasswordService {
    private userRepository: UserRepository;

    constructor(repository: UserRepository){
        this.userRepository = repository;
    }

    public async execute(login: string, token: string, password: string){
        const user = await this.userRepository.findByLogin(login);

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

        await this.userRepository.save(user);
    }
}
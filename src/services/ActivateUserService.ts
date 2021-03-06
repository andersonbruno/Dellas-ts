import UserRepository from "../repositories/UserRepository";

export default class ForgotPasswordService {

    private userRepository: UserRepository;

    constructor(repository: UserRepository){
        this.userRepository = repository;
    }

    public async execute(login: string, token: string){
        const user = await this.userRepository.findByLogin(login);

        if(!user){
            throw new Error('User not found');
        }

        if(token !== user.passwordResetToken){
            throw new Error('Token invalid');
        }

        user.isActivated = true;

        await this.userRepository.save(user);
    }
}
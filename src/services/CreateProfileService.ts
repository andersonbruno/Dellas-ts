import ProfileRepository from "../repositories/ProfileRepository";

export default class CreateProfileService {
    private repository: ProfileRepository;

    constructor(repository: ProfileRepository){
        this.repository = repository;
    }

    public async execute(name: string){
        const users = await this.repository.findByName(name);
        if(users){
            return users;
        }else{
            const profile = await this.repository.save({
                name
            });

            return profile;
        }
    }
}
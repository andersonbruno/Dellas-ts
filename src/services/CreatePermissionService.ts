import PermissionRepository from "../repositories/PermissionRepository";

export default class CreatePermissionService {
    private repository: PermissionRepository;

    constructor(repository: PermissionRepository){
        this.repository = repository;
    }

    public async execute(name: string){
        const users = await this.repository.findByName(name);
        if(users){
            return users;
        }else{
            const permission = await this.repository.save({
                name
            });

            return permission;
        }
    }
}
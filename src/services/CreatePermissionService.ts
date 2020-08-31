import PermissionRepository from "../repositories/PermissionRepository";
import Permission from '../entities/Permission';

export default class CreatePermissionService {
    private repository: PermissionRepository;

    constructor(repository: PermissionRepository){
        this.repository = repository;
    }

    public async execute(name: string): Promise<Permission>{
        const permissions = await this.repository.findByName(name);
        
        if(permissions){
            throw new Error('Permission already registered');
        }
            
        const permission = await this.repository.save({
            name
        });

        return permission;
        
    }
}
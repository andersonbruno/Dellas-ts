import { EntityRepository, Repository } from 'typeorm';
import Permission from '../entities/Permission';

@EntityRepository(Permission)
export default class PermissionRepository extends Repository<Permission> {
    
    public async findByName(name: string): Promise<Permission | undefined> {
        return await this.findOne({
            where: {
                name
            },
        });
    }

}
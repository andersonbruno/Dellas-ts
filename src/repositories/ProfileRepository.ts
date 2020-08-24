import { EntityRepository, Repository } from 'typeorm';
import Profile from '../models/Profile';

@EntityRepository(Profile)
export default class ProfileRepository extends Repository<Profile> {
    
    public async findByName(name: string): Promise<Profile | undefined> {
        return await this.findOne({
            where: {
                name
            },
        });
    }

}
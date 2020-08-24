import { EntityRepository, Repository } from 'typeorm';
import User from '../models/User';

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
    
    public async findByLogin(login: string): Promise<User | undefined> {
        return await this.findOne({
            where: {
                login
            },
            relations:  ["profile"] 
        });
    }

}
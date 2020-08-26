import { EntityRepository, Repository } from 'typeorm';
import User from '../entities/User';

@EntityRepository(User)
export default class UserRepository extends Repository<User> {
    
    public async findByLogin(login: string): Promise<User | undefined> {
        return await this.findOne({
            where: {
                login
            },
            relations:  ["permission"] 
        });
    }


    public async findByEmail(email: string): Promise<User | undefined> {
        return await this.findOne({
            where: {
                email
            },
            relations:  ["permission"] 
        });
    }

}
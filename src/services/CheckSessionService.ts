import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.json';

interface ITokenPayload {
    id: number
}

export default class CheckSessionService {

    public execute(authHeader: string | undefined): number{
        if(!authHeader){
            throw new Error('No token provided');
        }
    
        const parts = authHeader.split(' ');
    
        if(parts.length !== 2){
            throw new Error('Token error');       
        }
    
        const [ scheme, token ] = parts;
    
        if(!/^Bearer$/i.test(scheme)){
            throw new Error('Token malformatted');
        }
    
        try{
            const decoded= jwt.verify(token, authConfig.secret);
    
            const { id } = decoded as ITokenPayload;
    
            return id;
        } catch {
            throw new Error('Token invalid');
        }
    }

}
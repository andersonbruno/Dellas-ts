import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.json';
import User from '../entities/User';

interface ITokenPayload {
    id: number
}

export default function auth (req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

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

        req.user = {
            id
        }

        return next();
    } catch {
        throw new Error('Token invalid');
    }
    
}
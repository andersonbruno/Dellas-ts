import { Request, Response, NextFunction } from 'express';
import CheckSessionService from '../services/CheckSessionService';

export default function auth (req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    try{
        const service = new CheckSessionService();
        const id = service.execute(authHeader);

        req.user = {
            id
        }

        return next();
    }catch( err ){
        res.status(400).send({ message: err.message });
    } 

}
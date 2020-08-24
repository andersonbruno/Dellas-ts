import { Router } from 'express';
import profileRouter from './profile.routes';
import userRouter from './user.routes';

const routes = Router();

routes.use('/profile', profileRouter);
routes.use('/user', userRouter);

export default routes;

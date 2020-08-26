import { Router } from 'express';
import permissionRouter from './permission.routes';
import userRouter from './user.routes';
import authRouter from './auth.routes';
import authMiddleware from '../middlewares/auth';

const routes = Router();

//routes.use(authMiddleware);
routes.use('/permission', permissionRouter);
routes.use('/user', userRouter);
routes.use('/auth', authRouter);

export default routes;

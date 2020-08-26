import { Router } from 'express';
import UserController from '../controllers/UserController';

const userRouter = Router();

userRouter.post('/', UserController.store);
userRouter.get('/', UserController.index);

export default userRouter;

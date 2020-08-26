import { Router } from 'express';
import AuthController from '../controllers/AuthController';

const profileRouter = Router();

profileRouter.post('/', AuthController.authenticate);
profileRouter.post('/forgot_password', AuthController.forgotPassword);
profileRouter.post('/reset_password', AuthController.resetPassword);

export default profileRouter;

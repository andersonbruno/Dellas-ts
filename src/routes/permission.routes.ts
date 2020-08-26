import { Router } from 'express';
import PermissionController from '../controllers/PermissionController';

const permissionRouter = Router();

permissionRouter.post('/', PermissionController.store);
permissionRouter.get('/', PermissionController.index);

export default permissionRouter;

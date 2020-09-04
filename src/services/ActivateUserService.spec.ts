import connection from '../database/Connection';
import CreateUserService from './CreateUserService';
import CreatePermissionService from './CreatePermissionService';
import ActivateUserService from './ActivateUserService';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../repositories/UserRepository';
import PermissionRepository from '../repositories/PermissionRepository';
import User from '../entities/User';
import Permission from '../entities/Permission';

let userRepository: UserRepository;
let permissionRepository: PermissionRepository;
let createUserService: CreateUserService;
let createPermissionService: CreatePermissionService;
let activateUserService: ActivateUserService;
let permission: Permission;
let user: User;

beforeAll(async ()=>{
    await connection.create();

    userRepository = getCustomRepository(UserRepository);
    permissionRepository = getCustomRepository(PermissionRepository);
    createUserService = new CreateUserService(userRepository);
    createPermissionService = new CreatePermissionService(permissionRepository);
    activateUserService = new ActivateUserService(userRepository);
});

afterAll(async() => {
    await connection.close();
});

beforeEach(async() => {
    await connection.clear();
    permission = await createPermissionService.execute("Default");
    user = await createUserService.execute({
        name: 'Test User',
        email: 'user_test@user.com',
        login: 'userTest',
        password: '1234'
    });
});

it('should activate user with valid login and token', async () => {
    await expect(activateUserService.execute(user.login,user.passwordResetToken)).not.toThrowError;
});

it('should not activate user with invalid login', async () => {
    await expect(activateUserService.execute('newuser',user.passwordResetToken)).rejects.toBeInstanceOf(Error);
});

it('should not activate user with invalid login', async () => {
    await expect(activateUserService.execute(user.login,'token')).rejects.toBeInstanceOf(Error);
});
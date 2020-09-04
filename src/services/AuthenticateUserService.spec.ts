import connection from '../database/Connection';
import CreateUserService from './CreateUserService';
import CreatePermissionService from './CreatePermissionService';
import ActivateUserService from './ActivateUserService';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../repositories/UserRepository';
import PermissionRepository from '../repositories/PermissionRepository';
import User from '../entities/User';
import Permission from '../entities/Permission';
import AuthenticateUserService from './AuthenticateUserService';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.json';

let userRepository: UserRepository;
let permissionRepository: PermissionRepository;
let createUserService: CreateUserService;
let createPermissionService: CreatePermissionService;
let activateUserService: ActivateUserService;
let authenticateUserService: AuthenticateUserService;
let permission: Permission;
let user: {
    name: string;
    login: string;
    password: string;
    email: string;
}

beforeAll(async ()=>{
    await connection.create();

    userRepository = getCustomRepository(UserRepository);
    permissionRepository = getCustomRepository(PermissionRepository);
    createUserService = new CreateUserService(userRepository);
    createPermissionService = new CreatePermissionService(permissionRepository);
    activateUserService = new ActivateUserService(userRepository);
    authenticateUserService = new AuthenticateUserService(userRepository);
    
    user = {
        name: 'Test User',
        email: 'test_user2@user.com',
        login: 'test',
        password: '1234'
    };
});

afterAll(async ()=>{
    await connection.close();
});

beforeEach(async () =>{
    await connection.clear();
    permission = await createPermissionService.execute("Default");
    const newUser = await createUserService.execute(user);

    await activateUserService.execute(newUser.login,newUser.passwordResetToken);
});

afterEach(async () =>{
    await connection.clear();
});

it('should not authenticate with a invalid login', async () => {                                                                                                                                                                                                                                             
    await expect(authenticateUserService.execute('newUser', user.password)).rejects.toBeInstanceOf(Error);
});

it('should not authenticate with a invalid password', async () => {                                                                                                                                                                                                                                             
    await expect(authenticateUserService.execute(user.login, '564564')).rejects.toBeInstanceOf(Error);
});

it('should authenticate with a valid login and password', async () => {                                                                                                                                                                                                                                             
    const response = await authenticateUserService.execute(user.login, user.password);

    const decoded = jwt.verify(response.token, authConfig.secret);

    expect(response.user).toHaveProperty('id');
    expect(decoded).toHaveProperty('id');
});

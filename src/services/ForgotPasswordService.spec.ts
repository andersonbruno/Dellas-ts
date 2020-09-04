import connection from '../database/Connection';
import CreateUserService from './CreateUserService';
import CreatePermissionService from './CreatePermissionService';
import ActivateUserService from './ActivateUserService';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../repositories/UserRepository';
import PermissionRepository from '../repositories/PermissionRepository';
import User from '../entities/User';
import Permission from '../entities/Permission';
import ForgotPasswordService from './ForgotPasswordService';

let userRepository: UserRepository;
let permissionRepository: PermissionRepository;
let createUserService: CreateUserService;
let createPermissionService: CreatePermissionService;
let activateUserService: ActivateUserService;
let forgotPasswordService: ForgotPasswordService;
let permission: Permission;
let user: {
    name: string;
    login: string;
    password: string;
    email: string;
}

beforeAll(async ()=>{
    await connection.create();
    await connection.clear();

    userRepository = getCustomRepository(UserRepository);
    permissionRepository = getCustomRepository(PermissionRepository);
    createUserService = new CreateUserService(userRepository);
    createPermissionService = new CreatePermissionService(permissionRepository);
    activateUserService = new ActivateUserService(userRepository);
    forgotPasswordService = new ForgotPasswordService(userRepository);
    
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

it('should not able to submit forgot password with email that doesnt exist', async () => {                                                                                                                                                                                                                                             
    await expect(forgotPasswordService.execute('test@noreply.com')).rejects.toBeInstanceOf(Error);
});

it('should be able to submit forgot password with a valid email', async () => {
    const response = await forgotPasswordService.execute(user.email);

    expect(response.mailSent).toBe(true);
});
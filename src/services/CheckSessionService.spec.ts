import connection from '../database/Connection';
import CreateUserService from './CreateUserService';
import CreatePermissionService from './CreatePermissionService';
import ActivateUserService from './ActivateUserService';
import { getCustomRepository, Check } from 'typeorm';
import UserRepository from '../repositories/UserRepository';
import PermissionRepository from '../repositories/PermissionRepository';
import Permission from '../entities/Permission';
import ForgotPasswordService from './ForgotPasswordService';
import AuthenticateUserService from './AuthenticateUserService';
import CheckSessionService from './CheckSessionService';
import User from '../entities/User';

let userRepository: UserRepository;
let permissionRepository: PermissionRepository;
let createUserService: CreateUserService;
let createPermissionService: CreatePermissionService;
let activateUserService: ActivateUserService;
let forgotPasswordService: ForgotPasswordService;
let checkSessionService: CheckSessionService;
let authenticateUserService: AuthenticateUserService;
let permission: Permission;
let user: {
    name: string;
    login: string;
    password: string;
    email: string;
};
let response: {
    token: string;
    user: User;
};
let newUser: User;

beforeAll(async ()=>{
    await connection.create();
    await connection.clear();

    userRepository = getCustomRepository(UserRepository);
    permissionRepository = getCustomRepository(PermissionRepository);
    createUserService = new CreateUserService(userRepository);
    createPermissionService = new CreatePermissionService(permissionRepository);
    activateUserService = new ActivateUserService(userRepository);
    forgotPasswordService = new ForgotPasswordService(userRepository);
    authenticateUserService = new AuthenticateUserService(userRepository);
    checkSessionService = new CheckSessionService();
    
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
    newUser = await createUserService.execute(user);

    await activateUserService.execute(newUser.login,newUser.passwordResetToken);
    response = await authenticateUserService.execute(user.login, user.password);
});

afterEach(async () =>{
    await connection.clear();
});

it('should throw an error if an invalid token is informed', () => {                                                                                                                                                                                                                                             
    const authHeader = response.token;

    expect(() => {
        checkSessionService.execute(authHeader);
    }).toThrow('Token error');
});

it('should throw an error if a token malformatted is informed', () => {                                                                                                                                                                                                                                             
    const authHeader = "Berer " + response.token;

    expect(() => {
        checkSessionService.execute(authHeader);
    }).toThrow('Token malformatted');
});

it('should receive a valid token and return the user id', async () => {                                                                                                                                                                                                                                             
    const authHeader = "Bearer " + response.token;

    const userId = await checkSessionService.execute(authHeader);
    expect(userId).toBe(newUser.id);
});

it('should throw an error if the token is undefined', async () => {                                                                                                                                                                                                                                             
    expect(() => {
        checkSessionService.execute(undefined);
    }).toThrow('No token provided');
});

import connection from '../database/Connection';
import CreateUserService from './CreateUserService';
import CreatePermissionService from './CreatePermissionService';
import { getCustomRepository } from 'typeorm';
import UserRepository from '../repositories/UserRepository';
import PermissionRepository from '../repositories/PermissionRepository';
import bcryptjs from 'bcryptjs';

let userRepository: UserRepository;
let permissionRepository: PermissionRepository;
let createUserService: CreateUserService;
let createPermissionService: CreatePermissionService;
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

    user = {
        name: 'Test User',
        email: 'test@user.com',
        login: 'test',
        password: '1234'
    };
});

afterAll(async ()=>{
    await connection.close();
});

beforeEach(async ()=> {
    await connection.clear();
});

it('should create a new user', async () => {
    const permission = await createPermissionService.execute("Default");
    
    const newUser = await createUserService.execute(user);

    const hash = await bcryptjs.compare('1234', newUser.password);

    expect(newUser).toHaveProperty('id');
    expect(hash).toBe(true);
});

it('should not create user with duplicated email', async () => {
    const user2 = {
        name: 'Test User 2',
        email: 'test@user.com',
        login: 'test2',
        password: '1234'
    }

    await createUserService.execute(user);

    await expect(createUserService.execute(user2)).rejects.toBeInstanceOf(Error);
});

it('should not create user with duplicated login', async () => {

    const user2 = {
        name: 'Test User 2',
        email: 'test2@user.com',
        login: 'test',
        password: '1234'
    }

    await createUserService.execute(user);

    await expect(createUserService.execute(user2)).rejects.toBeInstanceOf(Error);
});
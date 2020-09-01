import connection from '../database/Connection';
import CreatePermissionService from './CreatePermissionService';
import { getCustomRepository } from 'typeorm';
import PermissionRepository from '../repositories/PermissionRepository';

let repository: PermissionRepository;
let createPermissionService: CreatePermissionService;

beforeAll(async () => {
    await connection.create();

    repository = getCustomRepository(PermissionRepository);
    createPermissionService = new CreatePermissionService(repository);
});

afterAll(async () => {
    await connection.close();
});

beforeEach(async () => {
    await connection.clear();
});

it('should create a new permission', async () => {
    const permission = await createPermissionService.execute("Test");

    expect(permission).toHaveProperty('id');
});

it('should not create a duplicated permission', async () => {
    await createPermissionService.execute("Test");

    await expect(createPermissionService.execute("Test")).rejects.toBeInstanceOf(Error);
});
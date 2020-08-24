import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateProfile11598126137852 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.createTable(
            new Table({
                name: 'users',
                columns:[
                    {
                        name: 'id',
                        type: 'int',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                        isNullable: false
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        isNullable: false,                 
                    },
                    {
                        name: 'login',
                        type: 'varchar',
                        isNullable: false,
                        isUnique: true,                           
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                        isNullable: false,                         
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isNullable: false,
                        isUnique: true,                           
                    },
                    {
                        name: 'password_reset_expiration',
                        type: 'timestamp',                      
                    },
                    {
                        name: 'password_Reset_Token',
                        type: 'varchar'
                    },
                    {
                        name: 'is_activated',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'profile_id',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()'
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()'
                    }
                ]
            })
        );

        await queryRunner.createForeignKey(
            'users',
            new TableForeignKey({
                name: 'ProfileUser',
                columnNames: ['profile_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'profiles',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey('users', 'ProfileUser');

        await queryRunner.dropTable('users');
    }

}

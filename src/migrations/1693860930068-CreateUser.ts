import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUser1693860930068 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'user',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        length: '36',
                    },
                    {
                        name: 'birth_date',
                        type: 'datetime',
                        isNullable: true,
                    },
                    {
                        name: 'username',
                        type: 'varchar',
                        isUnique: true,
                        isNullable: true,
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                        isUnique: true,
                    },
                    {
                        name: 'password',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'avatar',
                        type: 'varchar',
                        default: "'default.png'",
                    },
                    {
                        name: 'role',
                        type: 'enum',
                        enum: ['User', 'Admin'],
                        default: "'User'",
                    },
                    {
                        name: 'situation',
                        type: 'int',
                        default: 12,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user');
    }
}

import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
} from 'typeorm';

export class ResetPassword1693862000976 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'reset_password',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        length: '36',
                    },
                    {
                        name: 'token',
                        type: 'varchar',
                    },
                    {
                        name: 'user_id',
                        type: 'varchar',
                    },
                    {
                        name: 'used',
                        type: 'boolean',
                        default: false,
                    },
                    {
                        name: 'expires_at',
                        type: 'timestamp',
                    },
                ],
            }),
        );

        await queryRunner.createForeignKey(
            'reset_password',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('reset_password');
        const foreignKey = table!.foreignKeys.find(
            (fk) => fk.columnNames.indexOf('user_id') !== -1,
        );
        await queryRunner.dropForeignKey('reset_password', foreignKey!);
        await queryRunner.dropTable('reset_password');
    }
}

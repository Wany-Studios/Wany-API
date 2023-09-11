import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableColumn,
    TableForeignKey,
} from 'typeorm';
import { Genre } from '../modules/models/genre';

export class CreateGame1693860946598 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'game',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                    },
                    {
                        name: 'user_id',
                        type: 'varchar',
                    },
                    {
                        name: 'genre',
                        type: 'enum',
                        enum: Object.keys(Genre),
                    },
                    {
                        name: 'title',
                        type: 'varchar',
                    },
                    {
                        name: 'description',
                        type: 'varchar',
                    },
                    {
                        name: 'game_path',
                        type: 'varchar',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                ],
            }),
        );

        await queryRunner.createForeignKey(
            'game',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'user',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('game');
        const foreignKey = table!.foreignKeys.find(
            (fk) => fk.columnNames.indexOf('user_id') !== -1,
        );
        await queryRunner.dropForeignKey('game', foreignKey!);
        await queryRunner.dropColumn('game', 'user_id');
        await queryRunner.dropTable('game');
    }
}

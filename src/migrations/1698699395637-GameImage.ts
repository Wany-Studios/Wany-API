import {
    MigrationInterface,
    QueryRunner,
    Table,
    TableForeignKey,
} from 'typeorm';

export class GameImage1698699395637 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'game_image',
                columns: [
                    {
                        name: 'id',
                        type: 'varchar',
                        isPrimary: true,
                        length: '36',
                    },
                    {
                        name: 'game_id',
                        type: 'varchar',
                        length: '36',
                    },
                    {
                        name: 'image_path',
                        type: 'varchar',
                    },
                    {
                        name: 'cover',
                        type: 'boolean',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'now()',
                    },
                ],
            }),
        );

        await queryRunner.createForeignKey(
            'game_image',
            new TableForeignKey({
                columnNames: ['game_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'game',
                onDelete: 'CASCADE',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('game_image');
        const foreignKey = table!.foreignKeys.find(
            (fk) => fk.columnNames.indexOf('game_id') !== -1,
        );
        await queryRunner.dropForeignKey('game_image', foreignKey!);
        await queryRunner.dropColumn('game_image', 'game_id');
        await queryRunner.dropTable('game_image');
    }
}

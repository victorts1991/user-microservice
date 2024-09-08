import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateTables1717963983614 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')

        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'uuid',
                    isPrimary: true
                },
                {
                    name: 'name',
                    type: 'varchar',
                    length: '100',
                    isNullable: false
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isUnique: true,
                    length: '100', 
                    isNullable: false
                },
                {
                    name: 'password',
                    type: 'varchar',
                    length: '255', 
                    isNullable: false
                },
                {
                    name: 'created_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP'
                },
                {
                    name: 'updated_at',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP'
                }
            ]
        }))

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users')
    }

}

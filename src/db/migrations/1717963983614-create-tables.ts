import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1717963983614 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                "name" character varying(100) NOT NULL, 
                "email" character varying(70) NOT NULL, 
                "password" character varying(255) NOT NULL, 
                "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "deleted_at" TIMESTAMP, 
                CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"),
                UNIQUE (email)
            )`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}

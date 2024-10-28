import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMarkToQuizModel1730097841345 implements MigrationInterface {
    name = 'AddMarkToQuizModel1730097841345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`quiz\`
            ADD \`mark\` int NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`quiz\` DROP COLUMN \`mark\`
        `);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddLanguageToUser1733913303068 implements MigrationInterface {
    name = 'AddLanguageToUser1733913303068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`language\` enum ('en', 'ar') NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`language\`
        `);
    }

}

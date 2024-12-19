import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVerifyEmailToUser1734611098640 implements MigrationInterface {
    name = 'AddVerifyEmailToUser1734611098640'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`verifyEmail\` tinyint NOT NULL DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`verifyEmail\`
        `);
    }

}

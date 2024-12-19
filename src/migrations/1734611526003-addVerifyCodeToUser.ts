import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVerifyCodeToUser1734611526003 implements MigrationInterface {
    name = 'AddVerifyCodeToUser1734611526003'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`verifyCode\` int NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`verifyCode\`
        `);
    }

}

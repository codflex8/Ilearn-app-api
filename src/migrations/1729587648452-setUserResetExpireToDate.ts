import { MigrationInterface, QueryRunner } from "typeorm";

export class SetUserResetExpireToDate1729587648452 implements MigrationInterface {
    name = 'SetUserResetExpireToDate1729587648452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`passwordResetExpires\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`passwordResetExpires\` date NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`passwordResetExpires\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`passwordResetExpires\` int NULL
        `);
    }

}

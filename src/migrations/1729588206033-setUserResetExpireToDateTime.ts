import { MigrationInterface, QueryRunner } from "typeorm";

export class SetUserResetExpireToDateTime1729588206033 implements MigrationInterface {
    name = 'SetUserResetExpireToDateTime1729588206033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`passwordResetExpires\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`passwordResetExpires\` datetime NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`passwordResetExpires\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`passwordResetExpires\` date NULL
        `);
    }

}

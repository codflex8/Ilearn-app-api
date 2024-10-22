import { MigrationInterface, QueryRunner } from "typeorm";

export class AlertUserEntity1729539615553 implements MigrationInterface {
    name = 'AlertUserEntity1729539615553'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`imageUrl\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`passwordResetCode\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`passwordResetCode\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`passwordResetExpires\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`passwordResetExpires\` int NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`passwordResetExpires\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`passwordResetExpires\` datetime NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`passwordResetCode\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`passwordResetCode\` varchar(4) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`imageUrl\`
        `);
    }

}

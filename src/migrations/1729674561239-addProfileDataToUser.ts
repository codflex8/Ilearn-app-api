import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProfileDataToUser1729674561239 implements MigrationInterface {
    name = 'AddProfileDataToUser1729674561239'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`birthDate\` datetime NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`gender\` enum ('male', 'female') NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`updatedAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`createdAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`gender\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`birthDate\`
        `);
    }

}

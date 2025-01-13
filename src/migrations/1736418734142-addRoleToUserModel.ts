import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleToUserModel1736418734142 implements MigrationInterface {
    name = 'AddRoleToUserModel1736418734142'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`role\`
        `);
    }

}

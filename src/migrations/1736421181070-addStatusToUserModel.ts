import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusToUserModel1736421181070 implements MigrationInterface {
    name = 'AddStatusToUserModel1736421181070'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`status\` enum ('active', 'unactive') NOT NULL DEFAULT 'active'
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`status\`
        `);
    }

}

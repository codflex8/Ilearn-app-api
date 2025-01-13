import { MigrationInterface, QueryRunner } from "typeorm";

export class AdddashboardPasswordToUserModel1736422727769 implements MigrationInterface {
    name = 'AdddashboardPasswordToUserModel1736422727769'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`dashboardPassword\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`dashboardPassword\`
        `);
    }

}

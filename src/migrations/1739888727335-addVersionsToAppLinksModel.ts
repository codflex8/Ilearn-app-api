import { MigrationInterface, QueryRunner } from "typeorm";

export class AddVersionsToAppLinksModel1739888727335 implements MigrationInterface {
    name = 'AddVersionsToAppLinksModel1739888727335'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`app_links\`
            ADD \`androidVersion\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`app_links\`
            ADD \`appleVersion\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`app_links\` DROP COLUMN \`appleVersion\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`app_links\` DROP COLUMN \`androidVersion\`
        `);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFcmsToUserModel1733652833972 implements MigrationInterface {
    name = 'AddFcmsToUserModel1733652833972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`fcms\` text NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`fcms\`
        `);
    }

}

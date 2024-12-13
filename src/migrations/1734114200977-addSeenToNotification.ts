import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSeenToNotification1734114200977 implements MigrationInterface {
    name = 'AddSeenToNotification1734114200977'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD \`seen\` tinyint NOT NULL DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP COLUMN \`seen\`
        `);
    }

}

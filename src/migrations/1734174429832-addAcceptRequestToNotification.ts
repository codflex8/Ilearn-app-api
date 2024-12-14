import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAcceptRequestToNotification1734174429832 implements MigrationInterface {
    name = 'AddAcceptRequestToNotification1734174429832'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD \`acceptRequest\` tinyint NOT NULL DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP COLUMN \`acceptRequest\`
        `);
    }

}

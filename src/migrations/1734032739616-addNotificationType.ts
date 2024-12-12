import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNotificationType1734032739616 implements MigrationInterface {
    name = 'AddNotificationType1734032739616'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD \`type\` enum (
                    'JoinGroupRequest',
                    'UserAcceptJoinGroup',
                    'AdminAcceptJoinGroupRequest',
                    'NewGroupChatMessage',
                    'StatisticsReminder'
                ) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP COLUMN \`type\`
        `);
    }

}

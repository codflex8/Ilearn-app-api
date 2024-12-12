import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewNotificationType1734033953407 implements MigrationInterface {
    name = 'AddNewNotificationType1734033953407'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`notification\` CHANGE \`type\` \`type\` enum (
                    'JoinGroupRequest',
                    'UserAcceptJoinGroup',
                    'AdminAcceptJoinGroupRequest',
                    'NewGroupChatMessage',
                    'StatisticsReminder',
                    'UserAddedTOGroupChat'
                ) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`notification\` CHANGE \`type\` \`type\` enum (
                    'JoinGroupRequest',
                    'UserAcceptJoinGroup',
                    'AdminAcceptJoinGroupRequest',
                    'NewGroupChatMessage',
                    'StatisticsReminder'
                ) NOT NULL
        `);
    }

}

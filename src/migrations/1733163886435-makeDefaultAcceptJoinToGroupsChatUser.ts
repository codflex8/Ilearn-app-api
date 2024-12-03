import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeDefaultAcceptJoinToGroupsChatUser1733163886435 implements MigrationInterface {
    name = 'MakeDefaultAcceptJoinToGroupsChatUser1733163886435'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\` CHANGE \`acceptJoin\` \`acceptJoin\` tinyint NOT NULL DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\` CHANGE \`acceptJoin\` \`acceptJoin\` tinyint NOT NULL
        `);
    }

}

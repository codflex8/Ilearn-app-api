import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAcceptJoinToGroupsChatUser1733163488541 implements MigrationInterface {
    name = 'AddAcceptJoinToGroupsChatUser1733163488541'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\`
            ADD \`acceptJoin\` tinyint NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\` DROP COLUMN \`acceptJoin\`
        `);
    }

}

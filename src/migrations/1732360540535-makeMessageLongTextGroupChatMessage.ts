import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeMessageLongTextGroupChatMessage1732360540535 implements MigrationInterface {
    name = 'MakeMessageLongTextGroupChatMessage1732360540535'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` DROP COLUMN \`message\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\`
            ADD \`message\` longtext NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` DROP COLUMN \`message\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\`
            ADD \`message\` varchar(255) NULL
        `);
    }

}

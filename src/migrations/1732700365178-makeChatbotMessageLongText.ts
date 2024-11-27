import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeChatbotMessageLongText1732700365178 implements MigrationInterface {
    name = 'MakeChatbotMessageLongText1732700365178'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` DROP COLUMN \`message\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\`
            ADD \`message\` longtext NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` DROP COLUMN \`message\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\`
            ADD \`message\` varchar(255) NULL
        `);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFileUrlToChatbotMessages1733739080107 implements MigrationInterface {
    name = 'AddFileUrlToChatbotMessages1733739080107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\`
            ADD \`fileUrl\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` DROP COLUMN \`fileUrl\`
        `);
    }

}

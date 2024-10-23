import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFromToChatbotMesage1729706808690 implements MigrationInterface {
    name = 'AddFromToChatbotMesage1729706808690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` CHANGE \`audioUrl\` \`from\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` DROP COLUMN \`from\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\`
            ADD \`from\` enum ('user', 'chatbot') NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` DROP COLUMN \`from\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\`
            ADD \`from\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` CHANGE \`from\` \`audioUrl\` varchar(255) NULL
        `);
    }

}

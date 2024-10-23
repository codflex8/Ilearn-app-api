import { MigrationInterface, QueryRunner } from "typeorm";

export class AddChatbotAndChatbotMessagesModels1729684803452 implements MigrationInterface {
    name = 'AddChatbotAndChatbotMessagesModels1729684803452'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE \`chatbot\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`name\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`chatbot_messages\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`message\` varchar(255) NULL,
                \`recordUrl\` varchar(255) NULL,
                \`fileUrl\` varchar(255) NULL,
                \`audioUrl\` varchar(255) NULL,
                \`chatbotId\` varchar(36) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\`
            ADD CONSTRAINT \`FK_2f3601f3090a08bce653bf63d29\` FOREIGN KEY (\`chatbotId\`) REFERENCES \`chatbot\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` DROP FOREIGN KEY \`FK_2f3601f3090a08bce653bf63d29\`
        `);
        await queryRunner.query(`
            DROP TABLE \`chatbot_messages\`
        `);
        await queryRunner.query(`
            DROP TABLE \`chatbot\`
        `);
    }

}

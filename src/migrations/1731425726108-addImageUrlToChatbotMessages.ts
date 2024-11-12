import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageUrlToChatbotMessages1731425726108
  implements MigrationInterface
{
  name = "AddImageUrlToChatbotMessages1731425726108";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` CHANGE \`fileUrl\` \`imageUrl\` varchar(255) NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` DROP COLUMN \`imageUrl\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\`
            ADD \`imageUrl\` varchar(255) NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` DROP COLUMN \`imageUrl\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\`
            ADD \`imageUrl\` varchar(255) NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` CHANGE \`imageUrl\` \`fileUrl\` varchar(255) NULL
        `);
  }
}

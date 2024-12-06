import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeRelatedEntitiesOnDelete1733338175841
  implements MigrationInterface
{
  name = "CascadeRelatedEntitiesOnDelete1733338175841";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` DROP FOREIGN KEY \`FK_2d34990fcbdda4a568fbd8d856a\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\`
            ADD CONSTRAINT \`FK_2d34990fcbdda4a568fbd8d856a\` FOREIGN KEY (\`fromId\`) REFERENCES \`user\`(\`id\`) ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` DROP FOREIGN KEY \`FK_2d34990fcbdda4a568fbd8d856a\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\`
            ADD CONSTRAINT \`FK_2d34990fcbdda4a568fbd8d856a\` FOREIGN KEY (\`fromId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }
}

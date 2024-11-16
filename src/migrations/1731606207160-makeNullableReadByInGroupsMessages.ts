import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeNullableReadByInGroupsMessages1731606207160
  implements MigrationInterface
{
  name = "MakeNullableReadByInGroupsMessages1731606207160";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` CHANGE \`readbyIds\` \`readbyIds\` text NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` CHANGE \`readbyIds\` \`readbyIds\` text NOT NULL
        `);
  }
}

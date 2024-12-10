import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeFcmToStringInUser1733759557967
  implements MigrationInterface
{
  name = "ChangeFcmToStringInUser1733759557967";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`fcms\` \`fcm\` text NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`fcm\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`fcm\` varchar(255) NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`fcm\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`fcm\` text NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`fcm\` \`fcms\` text NOT NULL
        `);
  }
}

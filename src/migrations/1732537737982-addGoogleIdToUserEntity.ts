import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGoogleIdToUserEntity1732537737982
  implements MigrationInterface
{
  name = "AddGoogleIdToUserEntity1732537737982";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`googleId\` varchar(255) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`password\` \`password\` varchar(255) NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`password\` \`password\` varchar(255) NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`googleId\`
        `);
  }
}

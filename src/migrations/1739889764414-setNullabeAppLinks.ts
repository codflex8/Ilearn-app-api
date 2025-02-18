import { MigrationInterface, QueryRunner } from "typeorm";

export class SetNullabeAppLinks1739889764414 implements MigrationInterface {
  name = "SetNullabeAppLinks1739889764414";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`app_links\` CHANGE \`androidLink\` \`androidLink\` longtext NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`app_links\` CHANGE \`appleLink\` \`appleLink\` longtext NULL
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`app_links\` CHANGE \`appleLink\` \`appleLink\` longtext NOT NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`app_links\` CHANGE \`androidLink\` \`androidLink\` longtext NOT NULL
        `);
  }
}

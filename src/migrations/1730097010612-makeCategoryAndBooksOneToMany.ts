import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeCategoryAndBooksOneToMany1730097010612
  implements MigrationInterface
{
  name = "MakeCategoryAndBooksOneToMany1730097010612";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD \`categoryId\` varchar(36) NULL
        `);
    await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD CONSTRAINT \`FK_efaa1a4d8550ba5f4378803edb2\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`book\` DROP FOREIGN KEY \`FK_efaa1a4d8550ba5f4378803edb2\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`book\` DROP COLUMN \`categoryId\`
        `);
  }
}

import { MigrationInterface, QueryRunner } from "typeorm";

export class CascadeOndeleteQuestionBookmark1734361261948 implements MigrationInterface {
    name = 'CascadeOndeleteQuestionBookmark1734361261948'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`bookmark\` DROP FOREIGN KEY \`FK_74dc299f65fd243ff96fa84276f\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bookmark\`
            ADD CONSTRAINT \`FK_74dc299f65fd243ff96fa84276f\` FOREIGN KEY (\`questionId\`) REFERENCES \`question\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`bookmark\` DROP FOREIGN KEY \`FK_74dc299f65fd243ff96fa84276f\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bookmark\`
            ADD CONSTRAINT \`FK_74dc299f65fd243ff96fa84276f\` FOREIGN KEY (\`questionId\`) REFERENCES \`question\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

}

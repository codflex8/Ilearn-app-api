import { MigrationInterface, QueryRunner } from "typeorm";

export class AddisCorrectToQuestionObject1735820988606 implements MigrationInterface {
    name = 'AddisCorrectToQuestionObject1735820988606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`isCorrect\` tinyint NOT NULL DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`isCorrect\`
        `);
    }

}

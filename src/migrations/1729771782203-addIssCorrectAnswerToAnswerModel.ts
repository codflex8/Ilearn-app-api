import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIssCorrectAnswerToAnswerModel1729771782203 implements MigrationInterface {
    name = 'AddIssCorrectAnswerToAnswerModel1729771782203'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`answer\`
            ADD \`isCorrectAnswer\` tinyint NOT NULL DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`answer\` DROP COLUMN \`isCorrectAnswer\`
        `);
    }

}

import { MigrationInterface, QueryRunner } from "typeorm";

export class SetuserAnswerIndexAndAiAnswerIndexAndCorrectAnswerIndexToQuestion1731134403240 implements MigrationInterface {
    name = 'SetuserAnswerIndexAndAiAnswerIndexAndCorrectAnswerIndexToQuestion1731134403240'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`answer\` DROP COLUMN \`isCorrectAnswer\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`answer\` DROP COLUMN \`isUserAnswer\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`userAnswerIndex\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`aiAnswerIndex\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`correctAnswerIndex\` int NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`correctAnswerIndex\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`aiAnswerIndex\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`userAnswerIndex\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`answer\`
            ADD \`isUserAnswer\` tinyint NOT NULL DEFAULT '0'
        `);
        await queryRunner.query(`
            ALTER TABLE \`answer\`
            ADD \`isCorrectAnswer\` tinyint NOT NULL DEFAULT '0'
        `);
    }

}

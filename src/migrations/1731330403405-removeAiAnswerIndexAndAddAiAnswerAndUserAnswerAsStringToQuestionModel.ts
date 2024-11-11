import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveAiAnswerIndexAndAddAiAnswerAndUserAnswerAsStringToQuestionModel1731330403405 implements MigrationInterface {
    name = 'RemoveAiAnswerIndexAndAddAiAnswerAndUserAnswerAsStringToQuestionModel1731330403405'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`aiAnswerIndex\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`aiAnswer\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`userAnswer\` varchar(255) NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`userAnswer\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`aiAnswer\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`aiAnswerIndex\` int NULL
        `);
    }

}

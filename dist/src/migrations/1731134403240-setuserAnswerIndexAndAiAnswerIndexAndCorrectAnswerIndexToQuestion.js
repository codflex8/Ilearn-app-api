"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetuserAnswerIndexAndAiAnswerIndexAndCorrectAnswerIndexToQuestion1731134403240 = void 0;
class SetuserAnswerIndexAndAiAnswerIndexAndCorrectAnswerIndexToQuestion1731134403240 {
    constructor() {
        this.name = 'SetuserAnswerIndexAndAiAnswerIndexAndCorrectAnswerIndexToQuestion1731134403240';
    }
    async up(queryRunner) {
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
    async down(queryRunner) {
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
exports.SetuserAnswerIndexAndAiAnswerIndexAndCorrectAnswerIndexToQuestion1731134403240 = SetuserAnswerIndexAndAiAnswerIndexAndCorrectAnswerIndexToQuestion1731134403240;
//# sourceMappingURL=1731134403240-setuserAnswerIndexAndAiAnswerIndexAndCorrectAnswerIndexToQuestion.js.map
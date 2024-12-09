"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveAiAnswerIndexAndAddAiAnswerAndUserAnswerAsStringToQuestionModel1731330403405 = void 0;
class RemoveAiAnswerIndexAndAddAiAnswerAndUserAnswerAsStringToQuestionModel1731330403405 {
    constructor() {
        this.name = 'RemoveAiAnswerIndexAndAddAiAnswerAndUserAnswerAsStringToQuestionModel1731330403405';
    }
    async up(queryRunner) {
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
    async down(queryRunner) {
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
exports.RemoveAiAnswerIndexAndAddAiAnswerAndUserAnswerAsStringToQuestionModel1731330403405 = RemoveAiAnswerIndexAndAddAiAnswerAndUserAnswerAsStringToQuestionModel1731330403405;
//# sourceMappingURL=1731330403405-removeAiAnswerIndexAndAddAiAnswerAndUserAnswerAsStringToQuestionModel.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddIssCorrectAnswerToAnswerModel1729771782203 = void 0;
class AddIssCorrectAnswerToAnswerModel1729771782203 {
    constructor() {
        this.name = 'AddIssCorrectAnswerToAnswerModel1729771782203';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`answer\`
            ADD \`isCorrectAnswer\` tinyint NOT NULL DEFAULT 0
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`answer\` DROP COLUMN \`isCorrectAnswer\`
        `);
    }
}
exports.AddIssCorrectAnswerToAnswerModel1729771782203 = AddIssCorrectAnswerToAnswerModel1729771782203;
//# sourceMappingURL=1729771782203-addIssCorrectAnswerToAnswerModel.js.map
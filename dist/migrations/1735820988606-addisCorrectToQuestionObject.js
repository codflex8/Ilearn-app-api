"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddisCorrectToQuestionObject1735820988606 = void 0;
class AddisCorrectToQuestionObject1735820988606 {
    constructor() {
        this.name = 'AddisCorrectToQuestionObject1735820988606';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`isCorrect\` tinyint NOT NULL DEFAULT 0
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`isCorrect\`
        `);
    }
}
exports.AddisCorrectToQuestionObject1735820988606 = AddisCorrectToQuestionObject1735820988606;
//# sourceMappingURL=1735820988606-addisCorrectToQuestionObject.js.map
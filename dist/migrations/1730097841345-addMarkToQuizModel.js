"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddMarkToQuizModel1730097841345 = void 0;
class AddMarkToQuizModel1730097841345 {
    constructor() {
        this.name = 'AddMarkToQuizModel1730097841345';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`quiz\`
            ADD \`mark\` int NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`quiz\` DROP COLUMN \`mark\`
        `);
    }
}
exports.AddMarkToQuizModel1730097841345 = AddMarkToQuizModel1730097841345;
//# sourceMappingURL=1730097841345-addMarkToQuizModel.js.map
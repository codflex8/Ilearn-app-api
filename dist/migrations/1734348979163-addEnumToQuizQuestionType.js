"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddEnumToQuizQuestionType1734348979163 = void 0;
class AddEnumToQuizQuestionType1734348979163 {
    constructor() {
        this.name = 'AddEnumToQuizQuestionType1734348979163';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`quiz\` DROP COLUMN \`questionsType\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`quiz\`
            ADD \`questionsType\` enum ('MultiChoic', 'TrueFalse', 'Writing') NOT NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`quiz\` DROP COLUMN \`questionsType\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`quiz\`
            ADD \`questionsType\` varchar(255) NOT NULL
        `);
    }
}
exports.AddEnumToQuizQuestionType1734348979163 = AddEnumToQuizQuestionType1734348979163;
//# sourceMappingURL=1734348979163-addEnumToQuizQuestionType.js.map
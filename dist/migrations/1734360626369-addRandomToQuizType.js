"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRandomToQuizType1734360626369 = void 0;
class AddRandomToQuizType1734360626369 {
    constructor() {
        this.name = 'AddRandomToQuizType1734360626369';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`quiz\` CHANGE \`questionsType\` \`questionsType\` enum ('MultiChoic', 'TrueFalse', 'Writing', 'random') NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` CHANGE \`type\` \`type\` enum ('MultiChoic', 'TrueFalse', 'Writing', 'random') NOT NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`question\` CHANGE \`type\` \`type\` enum ('MultiChoic', 'TrueFalse', 'Writing') NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`quiz\` CHANGE \`questionsType\` \`questionsType\` enum ('MultiChoic', 'TrueFalse', 'Writing') NOT NULL
        `);
    }
}
exports.AddRandomToQuizType1734360626369 = AddRandomToQuizType1734360626369;
//# sourceMappingURL=1734360626369-addRandomToQuizType.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeStaticsFieldsOptional1732707563749 = void 0;
class MakeStaticsFieldsOptional1732707563749 {
    constructor() {
        this.name = 'MakeStaticsFieldsOptional1732707563749';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`booksGoal\` \`booksGoal\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`examsGoal\` \`examsGoal\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`intensePoints\` \`intensePoints\` int NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`intensePoints\` \`intensePoints\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`examsGoal\` \`examsGoal\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`booksGoal\` \`booksGoal\` int NOT NULL
        `);
    }
}
exports.MakeStaticsFieldsOptional1732707563749 = MakeStaticsFieldsOptional1732707563749;
//# sourceMappingURL=1732707563749-makeStaticsFieldsOptional.js.map
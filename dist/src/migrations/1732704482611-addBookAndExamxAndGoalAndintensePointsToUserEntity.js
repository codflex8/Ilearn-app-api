"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddBookAndExamxAndGoalAndintensePointsToUserEntity1732704482611 = void 0;
class AddBookAndExamxAndGoalAndintensePointsToUserEntity1732704482611 {
    constructor() {
        this.name = 'AddBookAndExamxAndGoalAndintensePointsToUserEntity1732704482611';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`booksGoal\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`examsGoal\` int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`intensePoints\` int NOT NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`intensePoints\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`examsGoal\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`booksGoal\`
        `);
    }
}
exports.AddBookAndExamxAndGoalAndintensePointsToUserEntity1732704482611 = AddBookAndExamxAndGoalAndintensePointsToUserEntity1732704482611;
//# sourceMappingURL=1732704482611-addBookAndExamxAndGoalAndintensePointsToUserEntity.js.map
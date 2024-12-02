"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeStatisticsFieldsNotNullable1733137755601 = void 0;
class MakeStatisticsFieldsNotNullable1733137755601 {
    constructor() {
        this.name = 'MakeStatisticsFieldsNotNullable1733137755601';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`booksGoal\` \`booksGoal\` int NOT NULL DEFAULT '3'
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`examsGoal\` \`examsGoal\` int NOT NULL DEFAULT '4'
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`intensePoints\` \`intensePoints\` int NOT NULL DEFAULT '10'
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`intensePoints\` \`intensePoints\` int NULL DEFAULT '10'
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`examsGoal\` \`examsGoal\` int NULL DEFAULT '10'
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`booksGoal\` \`booksGoal\` int NULL DEFAULT '10'
        `);
    }
}
exports.MakeStatisticsFieldsNotNullable1733137755601 = MakeStatisticsFieldsNotNullable1733137755601;
//# sourceMappingURL=1733137755601-makeStatisticsFieldsNotNullable.js.map
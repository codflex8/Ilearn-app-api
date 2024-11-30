"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetDefaultValuesForStatisticsFieldsInUser1732956130313 = void 0;
class SetDefaultValuesForStatisticsFieldsInUser1732956130313 {
    constructor() {
        this.name = 'SetDefaultValuesForStatisticsFieldsInUser1732956130313';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`booksGoal\` \`booksGoal\` int NULL DEFAULT '10'
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`examsGoal\` \`examsGoal\` int NULL DEFAULT '10'
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`intensePoints\` \`intensePoints\` int NULL DEFAULT '10'
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`intensePoints\` \`intensePoints\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`examsGoal\` \`examsGoal\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`booksGoal\` \`booksGoal\` int NULL
        `);
    }
}
exports.SetDefaultValuesForStatisticsFieldsInUser1732956130313 = SetDefaultValuesForStatisticsFieldsInUser1732956130313;
//# sourceMappingURL=1732956130313-setDefaultValuesForStatisticsFieldsInUser.js.map
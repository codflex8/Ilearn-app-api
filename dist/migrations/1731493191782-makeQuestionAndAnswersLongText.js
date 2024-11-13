"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeQuestionAndAnswersLongText1731493191782 = void 0;
class MakeQuestionAndAnswersLongText1731493191782 {
    constructor() {
        this.name = 'MakeQuestionAndAnswersLongText1731493191782';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`answer\` DROP COLUMN \`answer\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`answer\`
            ADD \`answer\` longtext NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`question\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`question\` longtext NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`aiAnswer\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`aiAnswer\` longtext NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`userAnswer\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`userAnswer\` longtext NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`userAnswer\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`userAnswer\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`aiAnswer\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`aiAnswer\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`question\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`question\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`answer\` DROP COLUMN \`answer\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`answer\`
            ADD \`answer\` varchar(255) NOT NULL
        `);
    }
}
exports.MakeQuestionAndAnswersLongText1731493191782 = MakeQuestionAndAnswersLongText1731493191782;
//# sourceMappingURL=1731493191782-makeQuestionAndAnswersLongText.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddisUserAnswerToAnswerModel1730020165324 = void 0;
class AddisUserAnswerToAnswerModel1730020165324 {
    constructor() {
        this.name = 'AddisUserAnswerToAnswerModel1730020165324';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            DROP INDEX \`IDX_ef7abf7e6495d7ef5d6607bd7a\` ON \`question\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`answer\`
            ADD \`isUserAnswer\` tinyint NOT NULL DEFAULT 0
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`answer\` DROP COLUMN \`isUserAnswer\`
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`IDX_ef7abf7e6495d7ef5d6607bd7a\` ON \`question\` (\`userAnswerId\`)
        `);
    }
}
exports.AddisUserAnswerToAnswerModel1730020165324 = AddisUserAnswerToAnswerModel1730020165324;
//# sourceMappingURL=1730020165324-addisUserAnswerToAnswerModel.js.map
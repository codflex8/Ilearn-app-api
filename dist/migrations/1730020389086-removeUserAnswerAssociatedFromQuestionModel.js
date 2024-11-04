"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveUserAnswerAssociatedFromQuestionModel1730020389086 = void 0;
class RemoveUserAnswerAssociatedFromQuestionModel1730020389086 {
    constructor() {
        this.name = 'RemoveUserAnswerAssociatedFromQuestionModel1730020389086';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP FOREIGN KEY \`FK_ef7abf7e6495d7ef5d6607bd7a2\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_ef7abf7e6495d7ef5d6607bd7a\` ON \`question\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`userAnswerId\`
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`userAnswerId\` varchar(36) NULL
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`REL_ef7abf7e6495d7ef5d6607bd7a\` ON \`question\` (\`userAnswerId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD CONSTRAINT \`FK_ef7abf7e6495d7ef5d6607bd7a2\` FOREIGN KEY (\`userAnswerId\`) REFERENCES \`answer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
}
exports.RemoveUserAnswerAssociatedFromQuestionModel1730020389086 = RemoveUserAnswerAssociatedFromQuestionModel1730020389086;
//# sourceMappingURL=1730020389086-removeUserAnswerAssociatedFromQuestionModel.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUserAnswerToQuestion1729932898554 = void 0;
class AddUserAnswerToQuestion1729932898554 {
    constructor() {
        this.name = 'AddUserAnswerToQuestion1729932898554';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD \`userAnswerId\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD UNIQUE INDEX \`IDX_ef7abf7e6495d7ef5d6607bd7a\` (\`userAnswerId\`)
        `);
        await queryRunner.query(`
            CREATE UNIQUE INDEX \`REL_ef7abf7e6495d7ef5d6607bd7a\` ON \`question\` (\`userAnswerId\`)
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\`
            ADD CONSTRAINT \`FK_ef7abf7e6495d7ef5d6607bd7a2\` FOREIGN KEY (\`userAnswerId\`) REFERENCES \`answer\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP FOREIGN KEY \`FK_ef7abf7e6495d7ef5d6607bd7a2\`
        `);
        await queryRunner.query(`
            DROP INDEX \`REL_ef7abf7e6495d7ef5d6607bd7a\` ON \`question\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP INDEX \`IDX_ef7abf7e6495d7ef5d6607bd7a\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`question\` DROP COLUMN \`userAnswerId\`
        `);
    }
}
exports.AddUserAnswerToQuestion1729932898554 = AddUserAnswerToQuestion1729932898554;
//# sourceMappingURL=1729932898554-addUserAnswerToQuestion.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPhonNumberToUser1729663684065 = void 0;
class AddPhonNumberToUser1729663684065 {
    constructor() {
        this.name = 'AddPhonNumberToUser1729663684065';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`phoneNumber\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD UNIQUE INDEX \`IDX_f2578043e491921209f5dadd08\` (\`phoneNumber\`)
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP INDEX \`IDX_f2578043e491921209f5dadd08\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`phoneNumber\`
        `);
    }
}
exports.AddPhonNumberToUser1729663684065 = AddPhonNumberToUser1729663684065;
//# sourceMappingURL=1729663684065-addPhonNumberToUser.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetUserResetExpireToDate1729587648452 = void 0;
class SetUserResetExpireToDate1729587648452 {
    constructor() {
        this.name = 'SetUserResetExpireToDate1729587648452';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`passwordResetExpires\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`passwordResetExpires\` date NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`passwordResetExpires\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`passwordResetExpires\` int NULL
        `);
    }
}
exports.SetUserResetExpireToDate1729587648452 = SetUserResetExpireToDate1729587648452;
//# sourceMappingURL=1729587648452-setUserResetExpireToDate.js.map
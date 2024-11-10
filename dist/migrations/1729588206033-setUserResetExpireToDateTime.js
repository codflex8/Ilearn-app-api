"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetUserResetExpireToDateTime1729588206033 = void 0;
class SetUserResetExpireToDateTime1729588206033 {
    constructor() {
        this.name = 'SetUserResetExpireToDateTime1729588206033';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`passwordResetExpires\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`passwordResetExpires\` datetime NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`passwordResetExpires\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`passwordResetExpires\` date NULL
        `);
    }
}
exports.SetUserResetExpireToDateTime1729588206033 = SetUserResetExpireToDateTime1729588206033;
//# sourceMappingURL=1729588206033-setUserResetExpireToDateTime.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddVerifyEmailToUser1734611098640 = void 0;
class AddVerifyEmailToUser1734611098640 {
    constructor() {
        this.name = 'AddVerifyEmailToUser1734611098640';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`verifyEmail\` tinyint NOT NULL DEFAULT 0
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`verifyEmail\`
        `);
    }
}
exports.AddVerifyEmailToUser1734611098640 = AddVerifyEmailToUser1734611098640;
//# sourceMappingURL=1734611098640-addVerifyEmailToUser.js.map
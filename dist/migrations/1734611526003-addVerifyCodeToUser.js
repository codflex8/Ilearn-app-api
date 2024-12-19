"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddVerifyCodeToUser1734611526003 = void 0;
class AddVerifyCodeToUser1734611526003 {
    constructor() {
        this.name = 'AddVerifyCodeToUser1734611526003';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`verifyCode\` int NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`verifyCode\`
        `);
    }
}
exports.AddVerifyCodeToUser1734611526003 = AddVerifyCodeToUser1734611526003;
//# sourceMappingURL=1734611526003-addVerifyCodeToUser.js.map
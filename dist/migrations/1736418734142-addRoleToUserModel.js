"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRoleToUserModel1736418734142 = void 0;
class AddRoleToUserModel1736418734142 {
    constructor() {
        this.name = 'AddRoleToUserModel1736418734142';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`role\` enum ('user', 'admin') NOT NULL DEFAULT 'user'
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`role\`
        `);
    }
}
exports.AddRoleToUserModel1736418734142 = AddRoleToUserModel1736418734142;
//# sourceMappingURL=1736418734142-addRoleToUserModel.js.map
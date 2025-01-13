"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddStatusToUserModel1736421181070 = void 0;
class AddStatusToUserModel1736421181070 {
    constructor() {
        this.name = 'AddStatusToUserModel1736421181070';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`status\` enum ('active', 'unactive') NOT NULL DEFAULT 'active'
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`status\`
        `);
    }
}
exports.AddStatusToUserModel1736421181070 = AddStatusToUserModel1736421181070;
//# sourceMappingURL=1736421181070-addStatusToUserModel.js.map
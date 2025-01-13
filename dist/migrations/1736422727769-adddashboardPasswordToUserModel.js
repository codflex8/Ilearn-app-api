"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdddashboardPasswordToUserModel1736422727769 = void 0;
class AdddashboardPasswordToUserModel1736422727769 {
    constructor() {
        this.name = 'AdddashboardPasswordToUserModel1736422727769';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`dashboardPassword\` varchar(255) NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`dashboardPassword\`
        `);
    }
}
exports.AdddashboardPasswordToUserModel1736422727769 = AdddashboardPasswordToUserModel1736422727769;
//# sourceMappingURL=1736422727769-adddashboardPasswordToUserModel.js.map
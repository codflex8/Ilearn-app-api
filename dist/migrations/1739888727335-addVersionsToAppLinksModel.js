"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddVersionsToAppLinksModel1739888727335 = void 0;
class AddVersionsToAppLinksModel1739888727335 {
    constructor() {
        this.name = 'AddVersionsToAppLinksModel1739888727335';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`app_links\`
            ADD \`androidVersion\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`app_links\`
            ADD \`appleVersion\` varchar(255) NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`app_links\` DROP COLUMN \`appleVersion\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`app_links\` DROP COLUMN \`androidVersion\`
        `);
    }
}
exports.AddVersionsToAppLinksModel1739888727335 = AddVersionsToAppLinksModel1739888727335;
//# sourceMappingURL=1739888727335-addVersionsToAppLinksModel.js.map
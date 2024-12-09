"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFcmsToUserModel1733652833972 = void 0;
class AddFcmsToUserModel1733652833972 {
    constructor() {
        this.name = 'AddFcmsToUserModel1733652833972';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`fcms\` text NOT NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`fcms\`
        `);
    }
}
exports.AddFcmsToUserModel1733652833972 = AddFcmsToUserModel1733652833972;
//# sourceMappingURL=1733652833972-addFcmsToUserModel.js.map
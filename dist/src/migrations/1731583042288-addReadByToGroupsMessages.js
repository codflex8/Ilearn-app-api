"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddReadByToGroupsMessages1731583042288 = void 0;
class AddReadByToGroupsMessages1731583042288 {
    constructor() {
        this.name = 'AddReadByToGroupsMessages1731583042288';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\`
            ADD \`readbyIds\` text NOT NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` DROP COLUMN \`readbyIds\`
        `);
    }
}
exports.AddReadByToGroupsMessages1731583042288 = AddReadByToGroupsMessages1731583042288;
//# sourceMappingURL=1731583042288-addReadByToGroupsMessages.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeMessageLongTextGroupChatMessage1732360540535 = void 0;
class MakeMessageLongTextGroupChatMessage1732360540535 {
    constructor() {
        this.name = 'MakeMessageLongTextGroupChatMessage1732360540535';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` DROP COLUMN \`message\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\`
            ADD \`message\` longtext NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` DROP COLUMN \`message\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\`
            ADD \`message\` varchar(255) NULL
        `);
    }
}
exports.MakeMessageLongTextGroupChatMessage1732360540535 = MakeMessageLongTextGroupChatMessage1732360540535;
//# sourceMappingURL=1732360540535-makeMessageLongTextGroupChatMessage.js.map
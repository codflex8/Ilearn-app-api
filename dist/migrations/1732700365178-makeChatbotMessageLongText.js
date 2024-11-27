"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeChatbotMessageLongText1732700365178 = void 0;
class MakeChatbotMessageLongText1732700365178 {
    constructor() {
        this.name = 'MakeChatbotMessageLongText1732700365178';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` DROP COLUMN \`message\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\`
            ADD \`message\` longtext NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` DROP COLUMN \`message\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\`
            ADD \`message\` varchar(255) NULL
        `);
    }
}
exports.MakeChatbotMessageLongText1732700365178 = MakeChatbotMessageLongText1732700365178;
//# sourceMappingURL=1732700365178-makeChatbotMessageLongText.js.map
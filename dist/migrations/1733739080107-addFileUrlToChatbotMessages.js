"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFileUrlToChatbotMessages1733739080107 = void 0;
class AddFileUrlToChatbotMessages1733739080107 {
    constructor() {
        this.name = 'AddFileUrlToChatbotMessages1733739080107';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\`
            ADD \`fileUrl\` varchar(255) NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` DROP COLUMN \`fileUrl\`
        `);
    }
}
exports.AddFileUrlToChatbotMessages1733739080107 = AddFileUrlToChatbotMessages1733739080107;
//# sourceMappingURL=1733739080107-addFileUrlToChatbotMessages.js.map
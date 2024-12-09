"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddImageUrlToChatbotMessages1731425726108 = void 0;
class AddImageUrlToChatbotMessages1731425726108 {
    constructor() {
        this.name = "AddImageUrlToChatbotMessages1731425726108";
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` CHANGE \`fileUrl\` \`imageUrl\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` DROP COLUMN \`imageUrl\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\`
            ADD \`imageUrl\` varchar(255) NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` DROP COLUMN \`imageUrl\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\`
            ADD \`imageUrl\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` CHANGE \`imageUrl\` \`fileUrl\` varchar(255) NULL
        `);
    }
}
exports.AddImageUrlToChatbotMessages1731425726108 = AddImageUrlToChatbotMessages1731425726108;
//# sourceMappingURL=1731425726108-addImageUrlToChatbotMessages.js.map
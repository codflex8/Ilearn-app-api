"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFromToChatbotMesage1729706808690 = void 0;
class AddFromToChatbotMesage1729706808690 {
    constructor() {
        this.name = 'AddFromToChatbotMesage1729706808690';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` CHANGE \`audioUrl\` \`from\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` DROP COLUMN \`from\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\`
            ADD \`from\` enum ('user', 'chatbot') NOT NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` DROP COLUMN \`from\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\`
            ADD \`from\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot_messages\` CHANGE \`from\` \`audioUrl\` varchar(255) NULL
        `);
    }
}
exports.AddFromToChatbotMesage1729706808690 = AddFromToChatbotMesage1729706808690;
//# sourceMappingURL=1729706808690-addFromToChatbotMesage.js.map
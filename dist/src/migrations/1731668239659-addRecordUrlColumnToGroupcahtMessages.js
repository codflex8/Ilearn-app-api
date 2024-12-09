"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRecordUrlColumnToGroupcahtMessages1731668239659 = void 0;
class AddRecordUrlColumnToGroupcahtMessages1731668239659 {
    constructor() {
        this.name = 'AddRecordUrlColumnToGroupcahtMessages1731668239659';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\`
            ADD \`recordUrl\` varchar(255) NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` DROP COLUMN \`recordUrl\`
        `);
    }
}
exports.AddRecordUrlColumnToGroupcahtMessages1731668239659 = AddRecordUrlColumnToGroupcahtMessages1731668239659;
//# sourceMappingURL=1731668239659-addRecordUrlColumnToGroupcahtMessages.js.map
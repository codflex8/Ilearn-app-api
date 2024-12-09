"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeLinkAndFileUrlNullableInGroupchatMessages1731522256814 = void 0;
class MakeLinkAndFileUrlNullableInGroupchatMessages1731522256814 {
    constructor() {
        this.name = 'MakeLinkAndFileUrlNullableInGroupchatMessages1731522256814';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` CHANGE \`link\` \`link\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` CHANGE \`fileUrl\` \`fileUrl\` varchar(255) NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` CHANGE \`fileUrl\` \`fileUrl\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` CHANGE \`link\` \`link\` varchar(255) NOT NULL
        `);
    }
}
exports.MakeLinkAndFileUrlNullableInGroupchatMessages1731522256814 = MakeLinkAndFileUrlNullableInGroupchatMessages1731522256814;
//# sourceMappingURL=1731522256814-makeLinkAndFileUrlNullableInGroupchatMessages.js.map
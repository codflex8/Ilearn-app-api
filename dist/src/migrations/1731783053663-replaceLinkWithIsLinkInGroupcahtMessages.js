"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReplaceLinkWithIsLinkInGroupcahtMessages1731783053663 = void 0;
class ReplaceLinkWithIsLinkInGroupcahtMessages1731783053663 {
    constructor() {
        this.name = 'ReplaceLinkWithIsLinkInGroupcahtMessages1731783053663';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` CHANGE \`link\` \`isLink\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` DROP COLUMN \`isLink\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\`
            ADD \`isLink\` tinyint NOT NULL DEFAULT 0
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` DROP COLUMN \`isLink\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\`
            ADD \`isLink\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` CHANGE \`isLink\` \`link\` varchar(255) NULL
        `);
    }
}
exports.ReplaceLinkWithIsLinkInGroupcahtMessages1731783053663 = ReplaceLinkWithIsLinkInGroupcahtMessages1731783053663;
//# sourceMappingURL=1731783053663-replaceLinkWithIsLinkInGroupcahtMessages.js.map
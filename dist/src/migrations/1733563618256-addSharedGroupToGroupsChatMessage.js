"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSharedGroupToGroupsChatMessage1733563618256 = void 0;
class AddSharedGroupToGroupsChatMessage1733563618256 {
    constructor() {
        this.name = 'AddSharedGroupToGroupsChatMessage1733563618256';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\`
            ADD \`shared_group_id\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\`
            ADD CONSTRAINT \`FK_2a25bbaa4e05d24f675f5df65a4\` FOREIGN KEY (\`shared_group_id\`) REFERENCES \`groups_chat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` DROP FOREIGN KEY \`FK_2a25bbaa4e05d24f675f5df65a4\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` DROP COLUMN \`shared_group_id\`
        `);
    }
}
exports.AddSharedGroupToGroupsChatMessage1733563618256 = AddSharedGroupToGroupsChatMessage1733563618256;
//# sourceMappingURL=1733563618256-addSharedGroupToGroupsChatMessage.js.map
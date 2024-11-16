"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeNullableReadByInGroupsMessages1731606207160 = void 0;
class MakeNullableReadByInGroupsMessages1731606207160 {
    constructor() {
        this.name = "MakeNullableReadByInGroupsMessages1731606207160";
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` CHANGE \`readbyIds\` \`readbyIds\` text NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` CHANGE \`readbyIds\` \`readbyIds\` text NOT NULL
        `);
    }
}
exports.MakeNullableReadByInGroupsMessages1731606207160 = MakeNullableReadByInGroupsMessages1731606207160;
//# sourceMappingURL=1731606207160-makeNullableReadByInGroupsMessages.js.map
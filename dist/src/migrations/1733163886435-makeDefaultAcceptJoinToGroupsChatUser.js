"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeDefaultAcceptJoinToGroupsChatUser1733163886435 = void 0;
class MakeDefaultAcceptJoinToGroupsChatUser1733163886435 {
    constructor() {
        this.name = 'MakeDefaultAcceptJoinToGroupsChatUser1733163886435';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\` CHANGE \`acceptJoin\` \`acceptJoin\` tinyint NOT NULL DEFAULT 0
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\` CHANGE \`acceptJoin\` \`acceptJoin\` tinyint NOT NULL
        `);
    }
}
exports.MakeDefaultAcceptJoinToGroupsChatUser1733163886435 = MakeDefaultAcceptJoinToGroupsChatUser1733163886435;
//# sourceMappingURL=1733163886435-makeDefaultAcceptJoinToGroupsChatUser.js.map
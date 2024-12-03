"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAcceptJoinToGroupsChatUser1733163488541 = void 0;
class AddAcceptJoinToGroupsChatUser1733163488541 {
    constructor() {
        this.name = 'AddAcceptJoinToGroupsChatUser1733163488541';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\`
            ADD \`acceptJoin\` tinyint NOT NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\` DROP COLUMN \`acceptJoin\`
        `);
    }
}
exports.AddAcceptJoinToGroupsChatUser1733163488541 = AddAcceptJoinToGroupsChatUser1733163488541;
//# sourceMappingURL=1733163488541-addAcceptJoinToGroupsChatUser.js.map
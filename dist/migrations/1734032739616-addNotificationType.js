"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddNotificationType1734032739616 = void 0;
class AddNotificationType1734032739616 {
    constructor() {
        this.name = 'AddNotificationType1734032739616';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD \`type\` enum (
                    'JoinGroupRequest',
                    'UserAcceptJoinGroup',
                    'AdminAcceptJoinGroupRequest',
                    'NewGroupChatMessage',
                    'StatisticsReminder'
                ) NOT NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP COLUMN \`type\`
        `);
    }
}
exports.AddNotificationType1734032739616 = AddNotificationType1734032739616;
//# sourceMappingURL=1734032739616-addNotificationType.js.map
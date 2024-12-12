"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddNewNotificationType1734033953407 = void 0;
class AddNewNotificationType1734033953407 {
    constructor() {
        this.name = 'AddNewNotificationType1734033953407';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`notification\` CHANGE \`type\` \`type\` enum (
                    'JoinGroupRequest',
                    'UserAcceptJoinGroup',
                    'AdminAcceptJoinGroupRequest',
                    'NewGroupChatMessage',
                    'StatisticsReminder',
                    'UserAddedTOGroupChat'
                ) NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`notification\` CHANGE \`type\` \`type\` enum (
                    'JoinGroupRequest',
                    'UserAcceptJoinGroup',
                    'AdminAcceptJoinGroupRequest',
                    'NewGroupChatMessage',
                    'StatisticsReminder'
                ) NOT NULL
        `);
    }
}
exports.AddNewNotificationType1734033953407 = AddNewNotificationType1734033953407;
//# sourceMappingURL=1734033953407-addNewNotificationType.js.map
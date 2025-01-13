"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddUsersActivityModel1736646943714 = void 0;
class AddUsersActivityModel1736646943714 {
    constructor() {
        this.name = 'AddUsersActivityModel1736646943714';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`users_activities\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`count\` int NOT NULL,
                \`date\` datetime NOT NULL,
                \`usersIds\` text NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE \`users_activities\`
        `);
    }
}
exports.AddUsersActivityModel1736646943714 = AddUsersActivityModel1736646943714;
//# sourceMappingURL=1736646943714-addUsersActivityModel.js.map
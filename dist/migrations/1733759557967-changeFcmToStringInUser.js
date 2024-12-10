"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeFcmToStringInUser1733759557967 = void 0;
class ChangeFcmToStringInUser1733759557967 {
    constructor() {
        this.name = "ChangeFcmToStringInUser1733759557967";
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`fcms\` \`fcm\` text NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`fcm\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`fcm\` varchar(255) NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`fcm\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`fcm\` text NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`fcm\` \`fcms\` text NOT NULL
        `);
    }
}
exports.ChangeFcmToStringInUser1733759557967 = ChangeFcmToStringInUser1733759557967;
//# sourceMappingURL=1733759557967-changeFcmToStringInUser.js.map
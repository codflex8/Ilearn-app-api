"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAcceptRequestToNotification1734174429832 = void 0;
class AddAcceptRequestToNotification1734174429832 {
    constructor() {
        this.name = 'AddAcceptRequestToNotification1734174429832';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD \`acceptRequest\` tinyint NOT NULL DEFAULT 0
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP COLUMN \`acceptRequest\`
        `);
    }
}
exports.AddAcceptRequestToNotification1734174429832 = AddAcceptRequestToNotification1734174429832;
//# sourceMappingURL=1734174429832-addAcceptRequestToNotification.js.map
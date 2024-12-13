"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSeenToNotification1734114200977 = void 0;
class AddSeenToNotification1734114200977 {
    constructor() {
        this.name = 'AddSeenToNotification1734114200977';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD \`seen\` tinyint NOT NULL DEFAULT 0
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP COLUMN \`seen\`
        `);
    }
}
exports.AddSeenToNotification1734114200977 = AddSeenToNotification1734114200977;
//# sourceMappingURL=1734114200977-addSeenToNotification.js.map
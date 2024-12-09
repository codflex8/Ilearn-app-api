"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFromUserNotification1733734697933 = void 0;
class AddFromUserNotification1733734697933 {
    constructor() {
        this.name = 'AddFromUserNotification1733734697933';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD \`from_user_id\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD CONSTRAINT \`FK_4ad7d54b0b04b9b321ac13176c0\` FOREIGN KEY (\`from_user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_4ad7d54b0b04b9b321ac13176c0\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP COLUMN \`from_user_id\`
        `);
    }
}
exports.AddFromUserNotification1733734697933 = AddFromUserNotification1733734697933;
//# sourceMappingURL=1733734697933-addFromUserNotification.js.map
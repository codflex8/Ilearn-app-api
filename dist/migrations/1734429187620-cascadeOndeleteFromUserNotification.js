"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CascadeOndeleteFromUserNotification1734429187620 = void 0;
class CascadeOndeleteFromUserNotification1734429187620 {
    constructor() {
        this.name = 'CascadeOndeleteFromUserNotification1734429187620';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_4ad7d54b0b04b9b321ac13176c0\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD CONSTRAINT \`FK_4ad7d54b0b04b9b321ac13176c0\` FOREIGN KEY (\`from_user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE
            SET NULL ON UPDATE CASCADE
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_4ad7d54b0b04b9b321ac13176c0\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD CONSTRAINT \`FK_4ad7d54b0b04b9b321ac13176c0\` FOREIGN KEY (\`from_user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
}
exports.CascadeOndeleteFromUserNotification1734429187620 = CascadeOndeleteFromUserNotification1734429187620;
//# sourceMappingURL=1734429187620-cascadeOndeleteFromUserNotification.js.map
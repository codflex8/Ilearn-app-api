"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CascadeOndeleteNotifications1734361047970 = void 0;
class CascadeOndeleteNotifications1734361047970 {
    constructor() {
        this.name = 'CascadeOndeleteNotifications1734361047970';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_1ced25315eb974b73391fb1c81b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD CONSTRAINT \`FK_1ced25315eb974b73391fb1c81b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_1ced25315eb974b73391fb1c81b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD CONSTRAINT \`FK_1ced25315eb974b73391fb1c81b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
}
exports.CascadeOndeleteNotifications1734361047970 = CascadeOndeleteNotifications1734361047970;
//# sourceMappingURL=1734361047970-cascadeOndeleteNotifications.js.map
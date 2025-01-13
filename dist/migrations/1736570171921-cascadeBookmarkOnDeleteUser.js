"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CascadeBookmarkOnDeleteUser1736570171921 = void 0;
class CascadeBookmarkOnDeleteUser1736570171921 {
    constructor() {
        this.name = 'CascadeBookmarkOnDeleteUser1736570171921';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`bookmark\` DROP FOREIGN KEY \`FK_e389fc192c59bdce0847ef9ef8b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bookmark\`
            ADD CONSTRAINT \`FK_e389fc192c59bdce0847ef9ef8b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`bookmark\` DROP FOREIGN KEY \`FK_e389fc192c59bdce0847ef9ef8b\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bookmark\`
            ADD CONSTRAINT \`FK_e389fc192c59bdce0847ef9ef8b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
}
exports.CascadeBookmarkOnDeleteUser1736570171921 = CascadeBookmarkOnDeleteUser1736570171921;
//# sourceMappingURL=1736570171921-cascadeBookmarkOnDeleteUser.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CascadeOndeleteUserAndGroup1734360942474 = void 0;
class CascadeOndeleteUserAndGroup1734360942474 {
    constructor() {
        this.name = 'CascadeOndeleteUserAndGroup1734360942474';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\` DROP FOREIGN KEY \`FK_0df3a4a9c754e672fc43f87129a\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\` DROP FOREIGN KEY \`FK_fb58e9dcbf2cdd704c26abf3195\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\`
            ADD CONSTRAINT \`FK_0df3a4a9c754e672fc43f87129a\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\`
            ADD CONSTRAINT \`FK_fb58e9dcbf2cdd704c26abf3195\` FOREIGN KEY (\`groupChatId\`) REFERENCES \`groups_chat\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\` DROP FOREIGN KEY \`FK_fb58e9dcbf2cdd704c26abf3195\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\` DROP FOREIGN KEY \`FK_0df3a4a9c754e672fc43f87129a\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\`
            ADD CONSTRAINT \`FK_fb58e9dcbf2cdd704c26abf3195\` FOREIGN KEY (\`groupChatId\`) REFERENCES \`groups_chat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_users\`
            ADD CONSTRAINT \`FK_0df3a4a9c754e672fc43f87129a\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
}
exports.CascadeOndeleteUserAndGroup1734360942474 = CascadeOndeleteUserAndGroup1734360942474;
//# sourceMappingURL=1734360942474-cascadeOndeleteUserAndGroup.js.map
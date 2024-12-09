"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CascadeRelatedEntitiesOnDelete1733338175841 = void 0;
class CascadeRelatedEntitiesOnDelete1733338175841 {
    constructor() {
        this.name = "CascadeRelatedEntitiesOnDelete1733338175841";
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` DROP FOREIGN KEY \`FK_2d34990fcbdda4a568fbd8d856a\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\`
            ADD CONSTRAINT \`FK_2d34990fcbdda4a568fbd8d856a\` FOREIGN KEY (\`fromId\`) REFERENCES \`user\`(\`id\`) ON DELETE
            SET NULL ON UPDATE NO ACTION
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\` DROP FOREIGN KEY \`FK_2d34990fcbdda4a568fbd8d856a\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`groups_chat_messages\`
            ADD CONSTRAINT \`FK_2d34990fcbdda4a568fbd8d856a\` FOREIGN KEY (\`fromId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
}
exports.CascadeRelatedEntitiesOnDelete1733338175841 = CascadeRelatedEntitiesOnDelete1733338175841;
//# sourceMappingURL=1733338175841-cascadeRelatedEntitiesOnDelete.js.map
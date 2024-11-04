"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddBaseModelToBooksAndCategories1729683732572 = void 0;
class AddBaseModelToBooksAndCategories1729683732572 {
    constructor() {
        this.name = 'AddBaseModelToBooksAndCategories1729683732572';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
        `);
        await queryRunner.query(`
            ALTER TABLE \`category\`
            ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        `);
        await queryRunner.query(`
            ALTER TABLE \`category\`
            ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`category\` DROP COLUMN \`updatedAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`category\` DROP COLUMN \`createdAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP COLUMN \`updatedAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP COLUMN \`createdAt\`
        `);
    }
}
exports.AddBaseModelToBooksAndCategories1729683732572 = AddBaseModelToBooksAndCategories1729683732572;
//# sourceMappingURL=1729683732572-addBaseModelToBooksAndCategories.js.map
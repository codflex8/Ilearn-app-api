"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddProfileDataToUser1729674561239 = void 0;
class AddProfileDataToUser1729674561239 {
    constructor() {
        this.name = 'AddProfileDataToUser1729674561239';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`birthDate\` datetime NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`gender\` enum ('male', 'female') NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`updatedAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`createdAt\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`gender\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`birthDate\`
        `);
    }
}
exports.AddProfileDataToUser1729674561239 = AddProfileDataToUser1729674561239;
//# sourceMappingURL=1729674561239-addProfileDataToUser.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertUserEntity1729539615553 = void 0;
class AlertUserEntity1729539615553 {
    constructor() {
        this.name = 'AlertUserEntity1729539615553';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`imageUrl\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`passwordResetCode\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`passwordResetCode\` int NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`passwordResetExpires\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`passwordResetExpires\` int NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`passwordResetExpires\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`passwordResetExpires\` datetime NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`passwordResetCode\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`passwordResetCode\` varchar(4) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`imageUrl\`
        `);
    }
}
exports.AlertUserEntity1729539615553 = AlertUserEntity1729539615553;
//# sourceMappingURL=1729539615553-alertUserEntity.js.map
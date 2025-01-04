"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChageShareGroupToShareApp1736014637999 = void 0;
class ChageShareGroupToShareApp1736014637999 {
    constructor() {
        this.name = 'ChageShareGroupToShareApp1736014637999';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`share_app\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`userId\` varchar(36) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`share_app\`
            ADD CONSTRAINT \`FK_782d51d463e98462191a8f7dd4c\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`share_app\` DROP FOREIGN KEY \`FK_782d51d463e98462191a8f7dd4c\`
        `);
        await queryRunner.query(`
            DROP TABLE \`share_app\`
        `);
    }
}
exports.ChageShareGroupToShareApp1736014637999 = ChageShareGroupToShareApp1736014637999;
//# sourceMappingURL=1736014637999-chageShareGroupToShareApp.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitMigrate1729509843454 = void 0;
class InitMigrate1729509843454 {
    constructor() {
        this.name = 'InitMigrate1729509843454';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`user\` (
                \`id\` varchar(36) NOT NULL,
                \`email\` varchar(255) NOT NULL,
                \`username\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`passwordChangedAt\` datetime NULL,
                \`passwordResetCode\` varchar(4) NULL,
                \`passwordResetExpires\` datetime NULL,
                \`passwordResetVerified\` tinyint NOT NULL DEFAULT 0,
                UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\`
        `);
        await queryRunner.query(`
            DROP TABLE \`user\`
        `);
    }
}
exports.InitMigrate1729509843454 = InitMigrate1729509843454;
//# sourceMappingURL=1729509843454-initMigrate.js.map
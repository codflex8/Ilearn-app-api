"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddReportModel1734546009525 = void 0;
class AddReportModel1734546009525 {
    constructor() {
        this.name = 'AddReportModel1734546009525';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`report\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`groupId\` varchar(36) NULL,
                \`userId\` varchar(36) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`report\`
            ADD CONSTRAINT \`FK_7a8e0cac9d701fdb852b7c45541\` FOREIGN KEY (\`groupId\`) REFERENCES \`groups_chat\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`report\`
            ADD CONSTRAINT \`FK_e347c56b008c2057c9887e230aa\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_e347c56b008c2057c9887e230aa\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`report\` DROP FOREIGN KEY \`FK_7a8e0cac9d701fdb852b7c45541\`
        `);
        await queryRunner.query(`
            DROP TABLE \`report\`
        `);
    }
}
exports.AddReportModel1734546009525 = AddReportModel1734546009525;
//# sourceMappingURL=1734546009525-addReportModel.js.map
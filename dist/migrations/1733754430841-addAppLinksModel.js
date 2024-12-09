"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddAppLinksModel1733754430841 = void 0;
class AddAppLinksModel1733754430841 {
    constructor() {
        this.name = 'AddAppLinksModel1733754430841';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`app_links\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`androidLink\` longtext NOT NULL,
                \`appleLink\` longtext NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE \`app_links\`
        `);
    }
}
exports.AddAppLinksModel1733754430841 = AddAppLinksModel1733754430841;
//# sourceMappingURL=1733754430841-addAppLinksModel.js.map
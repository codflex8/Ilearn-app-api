"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddShareGroupEntity1735818177839 = void 0;
class AddShareGroupEntity1735818177839 {
    constructor() {
        this.name = 'AddShareGroupEntity1735818177839';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`share_group\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`userId\` varchar(36) NULL,
                \`groupId\` varchar(36) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`share_group\`
            ADD CONSTRAINT \`FK_2f735d6bd8038c44f28f3372f36\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`share_group\`
            ADD CONSTRAINT \`FK_ba509f436b40e9d480d3e923ca8\` FOREIGN KEY (\`groupId\`) REFERENCES \`groups_chat\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`share_group\` DROP FOREIGN KEY \`FK_ba509f436b40e9d480d3e923ca8\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`share_group\` DROP FOREIGN KEY \`FK_2f735d6bd8038c44f28f3372f36\`
        `);
        await queryRunner.query(`
            DROP TABLE \`share_group\`
        `);
    }
}
exports.AddShareGroupEntity1735818177839 = AddShareGroupEntity1735818177839;
//# sourceMappingURL=1735818177839-addShareGroupEntity.js.map
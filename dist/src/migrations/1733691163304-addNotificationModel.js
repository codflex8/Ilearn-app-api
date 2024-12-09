"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddNotificationModel1733691163304 = void 0;
class AddNotificationModel1733691163304 {
    constructor() {
        this.name = 'AddNotificationModel1733691163304';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`notification\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`title\` varchar(255) NOT NULL,
                \`message\` varchar(255) NOT NULL,
                \`userId\` varchar(36) NULL,
                \`groupId\` varchar(36) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD CONSTRAINT \`FK_1ced25315eb974b73391fb1c81b\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD CONSTRAINT \`FK_2f7dcc604f60fce7609d29d809e\` FOREIGN KEY (\`groupId\`) REFERENCES \`groups_chat\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_2f7dcc604f60fce7609d29d809e\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP FOREIGN KEY \`FK_1ced25315eb974b73391fb1c81b\`
        `);
        await queryRunner.query(`
            DROP TABLE \`notification\`
        `);
    }
}
exports.AddNotificationModel1733691163304 = AddNotificationModel1733691163304;
//# sourceMappingURL=1733691163304-addNotificationModel.js.map
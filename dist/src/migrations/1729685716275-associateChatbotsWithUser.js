"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociateChatbotsWithUser1729685716275 = void 0;
class AssociateChatbotsWithUser1729685716275 {
    constructor() {
        this.name = "AssociateChatbotsWithUser1729685716275";
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`ChatbotsBooks\` (
                \`bookId\` varchar(36) NOT NULL,
                \`chatbotId\` varchar(36) NOT NULL,
                INDEX \`IDX_12447faf53fabd1dc658a48c92\` (\`bookId\`),
                INDEX \`IDX_dc6958f6f749c6176dd958b78b\` (\`chatbotId\`),
                PRIMARY KEY (\`bookId\`, \`chatbotId\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot\`
            ADD \`userId\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot\`
            ADD CONSTRAINT \`FK_173e55fec8ba8d54b7203e0d6d3\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`ChatbotsBooks\`
            ADD CONSTRAINT \`FK_12447faf53fabd1dc658a48c929\` FOREIGN KEY (\`bookId\`) REFERENCES \`chatbot\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`ChatbotsBooks\`
            ADD CONSTRAINT \`FK_dc6958f6f749c6176dd958b78b0\` FOREIGN KEY (\`chatbotId\`) REFERENCES \`book\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`ChatbotsBooks\` DROP FOREIGN KEY \`FK_dc6958f6f749c6176dd958b78b0\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`ChatbotsBooks\` DROP FOREIGN KEY \`FK_12447faf53fabd1dc658a48c929\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot\` DROP FOREIGN KEY \`FK_173e55fec8ba8d54b7203e0d6d3\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`chatbot\` DROP COLUMN \`userId\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_dc6958f6f749c6176dd958b78b\` ON \`ChatbotsBooks\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_12447faf53fabd1dc658a48c92\` ON \`ChatbotsBooks\`
        `);
        await queryRunner.query(`
            DROP TABLE \`ChatbotsBooks\`
        `);
    }
}
exports.AssociateChatbotsWithUser1729685716275 = AssociateChatbotsWithUser1729685716275;
//# sourceMappingURL=1729685716275-associateChatbotsWithUser.js.map
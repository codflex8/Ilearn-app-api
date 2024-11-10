"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssocciatCategoryAndBookWithUser1729660086052 = void 0;
class AssocciatCategoryAndBookWithUser1729660086052 {
    constructor() {
        this.name = 'AssocciatCategoryAndBookWithUser1729660086052';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD \`userId\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`category\`
            ADD \`userId\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD CONSTRAINT \`FK_04f66cf2a34f8efc5dcd9803693\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE \`category\`
            ADD CONSTRAINT \`FK_32b856438dffdc269fa84434d9f\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_32b856438dffdc269fa84434d9f\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP FOREIGN KEY \`FK_04f66cf2a34f8efc5dcd9803693\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`category\` DROP COLUMN \`userId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP COLUMN \`userId\`
        `);
    }
}
exports.AssocciatCategoryAndBookWithUser1729660086052 = AssocciatCategoryAndBookWithUser1729660086052;
//# sourceMappingURL=1729660086052-assocciatCategoryAndBookWithUser.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeCategoryAndBooksOneToMany1730097010612 = void 0;
class MakeCategoryAndBooksOneToMany1730097010612 {
    constructor() {
        this.name = "MakeCategoryAndBooksOneToMany1730097010612";
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD \`categoryId\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD CONSTRAINT \`FK_efaa1a4d8550ba5f4378803edb2\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP FOREIGN KEY \`FK_efaa1a4d8550ba5f4378803edb2\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP COLUMN \`categoryId\`
        `);
    }
}
exports.MakeCategoryAndBooksOneToMany1730097010612 = MakeCategoryAndBooksOneToMany1730097010612;
//# sourceMappingURL=1730097010612-makeCategoryAndBooksOneToMany.js.map
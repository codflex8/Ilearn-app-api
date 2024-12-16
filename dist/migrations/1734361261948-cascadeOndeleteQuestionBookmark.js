"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CascadeOndeleteQuestionBookmark1734361261948 = void 0;
class CascadeOndeleteQuestionBookmark1734361261948 {
    constructor() {
        this.name = 'CascadeOndeleteQuestionBookmark1734361261948';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`bookmark\` DROP FOREIGN KEY \`FK_74dc299f65fd243ff96fa84276f\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bookmark\`
            ADD CONSTRAINT \`FK_74dc299f65fd243ff96fa84276f\` FOREIGN KEY (\`questionId\`) REFERENCES \`question\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`bookmark\` DROP FOREIGN KEY \`FK_74dc299f65fd243ff96fa84276f\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`bookmark\`
            ADD CONSTRAINT \`FK_74dc299f65fd243ff96fa84276f\` FOREIGN KEY (\`questionId\`) REFERENCES \`question\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
}
exports.CascadeOndeleteQuestionBookmark1734361261948 = CascadeOndeleteQuestionBookmark1734361261948;
//# sourceMappingURL=1734361261948-cascadeOndeleteQuestionBookmark.js.map
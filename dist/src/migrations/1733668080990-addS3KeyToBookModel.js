"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddS3KeyToBookModel1733668080990 = void 0;
class AddS3KeyToBookModel1733668080990 {
    constructor() {
        this.name = 'AddS3KeyToBookModel1733668080990';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD \`s3Key\` varchar(255) NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP COLUMN \`s3Key\`
        `);
    }
}
exports.AddS3KeyToBookModel1733668080990 = AddS3KeyToBookModel1733668080990;
//# sourceMappingURL=1733668080990-addS3KeyToBookModel.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddLocalPathToBookModel1733742230216 = void 0;
class AddLocalPathToBookModel1733742230216 {
    constructor() {
        this.name = 'AddLocalPathToBookModel1733742230216';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`book\`
            ADD \`localPath\` varchar(255) NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`book\` DROP COLUMN \`localPath\`
        `);
    }
}
exports.AddLocalPathToBookModel1733742230216 = AddLocalPathToBookModel1733742230216;
//# sourceMappingURL=1733742230216-addLocalPathToBookModel.js.map
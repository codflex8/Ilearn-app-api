"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetImageUrlNullabeInBooksAndCategory1729596135060 = void 0;
class SetImageUrlNullabeInBooksAndCategory1729596135060 {
    constructor() {
        this.name = 'SetImageUrlNullabeInBooksAndCategory1729596135060';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`book\` CHANGE \`imageUrl\` \`imageUrl\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`category\` CHANGE \`imageUrl\` \`imageUrl\` varchar(255) NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`category\` CHANGE \`imageUrl\` \`imageUrl\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`book\` CHANGE \`imageUrl\` \`imageUrl\` varchar(255) NOT NULL
        `);
    }
}
exports.SetImageUrlNullabeInBooksAndCategory1729596135060 = SetImageUrlNullabeInBooksAndCategory1729596135060;
//# sourceMappingURL=1729596135060-setImageUrlNullabeInBooksAndCategory.js.map
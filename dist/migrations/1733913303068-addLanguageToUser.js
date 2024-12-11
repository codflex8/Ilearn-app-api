"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddLanguageToUser1733913303068 = void 0;
class AddLanguageToUser1733913303068 {
    constructor() {
        this.name = 'AddLanguageToUser1733913303068';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`language\` enum ('en', 'ar') NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`language\`
        `);
    }
}
exports.AddLanguageToUser1733913303068 = AddLanguageToUser1733913303068;
//# sourceMappingURL=1733913303068-addLanguageToUser.js.map
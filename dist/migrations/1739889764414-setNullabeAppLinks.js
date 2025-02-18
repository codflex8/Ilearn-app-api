"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetNullabeAppLinks1739889764414 = void 0;
class SetNullabeAppLinks1739889764414 {
    constructor() {
        this.name = "SetNullabeAppLinks1739889764414";
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`app_links\` CHANGE \`androidLink\` \`androidLink\` longtext NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`app_links\` CHANGE \`appleLink\` \`appleLink\` longtext NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`app_links\` CHANGE \`appleLink\` \`appleLink\` longtext NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`app_links\` CHANGE \`androidLink\` \`androidLink\` longtext NOT NULL
        `);
    }
}
exports.SetNullabeAppLinks1739889764414 = SetNullabeAppLinks1739889764414;
//# sourceMappingURL=1739889764414-setNullabeAppLinks.js.map
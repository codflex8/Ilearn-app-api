"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SetDefaultValueToPloicy1733907712011 = void 0;
class SetDefaultValueToPloicy1733907712011 {
    constructor() {
        this.name = 'SetDefaultValueToPloicy1733907712011';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`policy_and_terms\` CHANGE \`policy\` \`policy\` longtext NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`policy_and_terms\` CHANGE \`terms\` \`terms\` longtext NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`policy_and_terms\` CHANGE \`terms\` \`terms\` longtext NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`policy_and_terms\` CHANGE \`policy\` \`policy\` longtext NOT NULL
        `);
    }
}
exports.SetDefaultValueToPloicy1733907712011 = SetDefaultValueToPloicy1733907712011;
//# sourceMappingURL=1733907712011-setDefaultValueToPloicy.js.map
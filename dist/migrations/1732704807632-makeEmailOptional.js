"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeEmailOptional1732704807632 = void 0;
class MakeEmailOptional1732704807632 {
    constructor() {
        this.name = 'MakeEmailOptional1732704807632';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`email\` \`email\` varchar(255) NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`email\` \`email\` varchar(255) NOT NULL
        `);
    }
}
exports.MakeEmailOptional1732704807632 = MakeEmailOptional1732704807632;
//# sourceMappingURL=1732704807632-makeEmailOptional.js.map
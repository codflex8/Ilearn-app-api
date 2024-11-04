"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssociateUserWithQuizes1729759752021 = void 0;
class AssociateUserWithQuizes1729759752021 {
    constructor() {
        this.name = 'AssociateUserWithQuizes1729759752021';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`quiz\`
            ADD \`userId\` varchar(36) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`quiz\`
            ADD CONSTRAINT \`FK_52c158a608620611799fd63a927\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`quiz\` DROP FOREIGN KEY \`FK_52c158a608620611799fd63a927\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`quiz\` DROP COLUMN \`userId\`
        `);
    }
}
exports.AssociateUserWithQuizes1729759752021 = AssociateUserWithQuizes1729759752021;
//# sourceMappingURL=1729759752021-associateUserWithQuizes.js.map
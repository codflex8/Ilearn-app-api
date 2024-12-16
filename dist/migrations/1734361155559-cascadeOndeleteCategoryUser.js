"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CascadeOndeleteCategoryUser1734361155559 = void 0;
class CascadeOndeleteCategoryUser1734361155559 {
    constructor() {
        this.name = 'CascadeOndeleteCategoryUser1734361155559';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_32b856438dffdc269fa84434d9f\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`category\`
            ADD CONSTRAINT \`FK_32b856438dffdc269fa84434d9f\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`category\` DROP FOREIGN KEY \`FK_32b856438dffdc269fa84434d9f\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`category\`
            ADD CONSTRAINT \`FK_32b856438dffdc269fa84434d9f\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }
}
exports.CascadeOndeleteCategoryUser1734361155559 = CascadeOndeleteCategoryUser1734361155559;
//# sourceMappingURL=1734361155559-cascadeOndeleteCategoryUser.js.map
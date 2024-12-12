"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CahngeMessageToBodyNameAndAddDataAsJson1734026973024 = void 0;
class CahngeMessageToBodyNameAndAddDataAsJson1734026973024 {
    constructor() {
        this.name = 'CahngeMessageToBodyNameAndAddDataAsJson1734026973024';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP COLUMN \`message\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD \`body\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD \`data\` json NOT NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP COLUMN \`data\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`notification\` DROP COLUMN \`body\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`notification\`
            ADD \`message\` varchar(255) NOT NULL
        `);
    }
}
exports.CahngeMessageToBodyNameAndAddDataAsJson1734026973024 = CahngeMessageToBodyNameAndAddDataAsJson1734026973024;
//# sourceMappingURL=1734026973024-cahngeMessageToBodyNameAndAddDataAsJson.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddBookAndCategoriesModels1729595128635 = void 0;
class AddBookAndCategoriesModels1729595128635 {
    constructor() {
        this.name = 'AddBookAndCategoriesModels1729595128635';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`category\` (
                \`id\` varchar(36) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`imageUrl\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`book\` (
                \`id\` varchar(36) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`imageUrl\` varchar(255) NOT NULL,
                \`fileUrl\` varchar(255) NULL,
                \`link\` varchar(255) NULL,
                \`content\` varchar(255) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            CREATE TABLE \`CategoriesBooks\` (
                \`categoryId\` varchar(36) NOT NULL,
                \`bookId\` varchar(36) NOT NULL,
                INDEX \`IDX_bf8321b3032f76f5981a190694\` (\`categoryId\`),
                INDEX \`IDX_f2b9665b369b680e1d1ed77117\` (\`bookId\`),
                PRIMARY KEY (\`categoryId\`, \`bookId\`)
            ) ENGINE = InnoDB
        `);
        await queryRunner.query(`
            ALTER TABLE \`CategoriesBooks\`
            ADD CONSTRAINT \`FK_bf8321b3032f76f5981a1906948\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        await queryRunner.query(`
            ALTER TABLE \`CategoriesBooks\`
            ADD CONSTRAINT \`FK_f2b9665b369b680e1d1ed771170\` FOREIGN KEY (\`bookId\`) REFERENCES \`book\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`CategoriesBooks\` DROP FOREIGN KEY \`FK_f2b9665b369b680e1d1ed771170\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`CategoriesBooks\` DROP FOREIGN KEY \`FK_bf8321b3032f76f5981a1906948\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_f2b9665b369b680e1d1ed77117\` ON \`CategoriesBooks\`
        `);
        await queryRunner.query(`
            DROP INDEX \`IDX_bf8321b3032f76f5981a190694\` ON \`CategoriesBooks\`
        `);
        await queryRunner.query(`
            DROP TABLE \`CategoriesBooks\`
        `);
        await queryRunner.query(`
            DROP TABLE \`book\`
        `);
        await queryRunner.query(`
            DROP TABLE \`category\`
        `);
    }
}
exports.AddBookAndCategoriesModels1729595128635 = AddBookAndCategoriesModels1729595128635;
//# sourceMappingURL=1729595128635-addBookAndCategoriesModels.js.map
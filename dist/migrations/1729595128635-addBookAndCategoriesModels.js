"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddBookAndCategoriesModels1729595128635 = void 0;
class AddBookAndCategoriesModels1729595128635 {
    constructor() {
        this.name = 'AddBookAndCategoriesModels1729595128635';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            CREATE TABLE \`category\` (
                \`id\` varchar(36) NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`imageUrl\` varchar(255) NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
            yield queryRunner.query(`
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
            yield queryRunner.query(`
            CREATE TABLE \`CategoriesBooks\` (
                \`categoryId\` varchar(36) NOT NULL,
                \`bookId\` varchar(36) NOT NULL,
                INDEX \`IDX_bf8321b3032f76f5981a190694\` (\`categoryId\`),
                INDEX \`IDX_f2b9665b369b680e1d1ed77117\` (\`bookId\`),
                PRIMARY KEY (\`categoryId\`, \`bookId\`)
            ) ENGINE = InnoDB
        `);
            yield queryRunner.query(`
            ALTER TABLE \`CategoriesBooks\`
            ADD CONSTRAINT \`FK_bf8321b3032f76f5981a1906948\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
            yield queryRunner.query(`
            ALTER TABLE \`CategoriesBooks\`
            ADD CONSTRAINT \`FK_f2b9665b369b680e1d1ed771170\` FOREIGN KEY (\`bookId\`) REFERENCES \`book\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            ALTER TABLE \`CategoriesBooks\` DROP FOREIGN KEY \`FK_f2b9665b369b680e1d1ed771170\`
        `);
            yield queryRunner.query(`
            ALTER TABLE \`CategoriesBooks\` DROP FOREIGN KEY \`FK_bf8321b3032f76f5981a1906948\`
        `);
            yield queryRunner.query(`
            DROP INDEX \`IDX_f2b9665b369b680e1d1ed77117\` ON \`CategoriesBooks\`
        `);
            yield queryRunner.query(`
            DROP INDEX \`IDX_bf8321b3032f76f5981a190694\` ON \`CategoriesBooks\`
        `);
            yield queryRunner.query(`
            DROP TABLE \`CategoriesBooks\`
        `);
            yield queryRunner.query(`
            DROP TABLE \`book\`
        `);
            yield queryRunner.query(`
            DROP TABLE \`category\`
        `);
        });
    }
}
exports.AddBookAndCategoriesModels1729595128635 = AddBookAndCategoriesModels1729595128635;
//# sourceMappingURL=1729595128635-addBookAndCategoriesModels.js.map
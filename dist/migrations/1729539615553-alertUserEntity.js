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
exports.AlertUserEntity1729539615553 = void 0;
class AlertUserEntity1729539615553 {
    constructor() {
        this.name = 'AlertUserEntity1729539615553';
    }
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`imageUrl\` varchar(255) NULL
        `);
            yield queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`passwordResetCode\`
        `);
            yield queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`passwordResetCode\` int NULL
        `);
            yield queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`passwordResetExpires\`
        `);
            yield queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`passwordResetExpires\` int NULL
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`passwordResetExpires\`
        `);
            yield queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`passwordResetExpires\` datetime NULL
        `);
            yield queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`passwordResetCode\`
        `);
            yield queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`passwordResetCode\` varchar(4) NULL
        `);
            yield queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`imageUrl\`
        `);
        });
    }
}
exports.AlertUserEntity1729539615553 = AlertUserEntity1729539615553;
//# sourceMappingURL=1729539615553-alertUserEntity.js.map
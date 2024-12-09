"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddGoogleIdToUserEntity1732537737982 = void 0;
class AddGoogleIdToUserEntity1732537737982 {
    constructor() {
        this.name = "AddGoogleIdToUserEntity1732537737982";
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`googleId\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`password\` \`password\` varchar(255) NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`password\` \`password\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`googleId\`
        `);
    }
}
exports.AddGoogleIdToUserEntity1732537737982 = AddGoogleIdToUserEntity1732537737982;
//# sourceMappingURL=1732537737982-addGoogleIdToUserEntity.js.map
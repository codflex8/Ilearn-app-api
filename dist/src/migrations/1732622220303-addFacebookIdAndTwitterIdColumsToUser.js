"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddFacebookIdAndTwitterIdColumsToUser1732622220303 = void 0;
class AddFacebookIdAndTwitterIdColumsToUser1732622220303 {
    constructor() {
        this.name = 'AddFacebookIdAndTwitterIdColumsToUser1732622220303';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`facebookId\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\`
            ADD \`twitterId\` varchar(255) NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`googleId\` \`googleId\` varchar(255) NULL
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            ALTER TABLE \`user\` CHANGE \`googleId\` \`googleId\` varchar(255) NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`twitterId\`
        `);
        await queryRunner.query(`
            ALTER TABLE \`user\` DROP COLUMN \`facebookId\`
        `);
    }
}
exports.AddFacebookIdAndTwitterIdColumsToUser1732622220303 = AddFacebookIdAndTwitterIdColumsToUser1732622220303;
//# sourceMappingURL=1732622220303-addFacebookIdAndTwitterIdColumsToUser.js.map
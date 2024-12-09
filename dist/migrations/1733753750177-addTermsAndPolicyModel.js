"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddTermsAndPolicyModel1733753750177 = void 0;
class AddTermsAndPolicyModel1733753750177 {
    constructor() {
        this.name = 'AddTermsAndPolicyModel1733753750177';
    }
    async up(queryRunner) {
        await queryRunner.query(`
            CREATE TABLE \`policy_and_terms\` (
                \`id\` varchar(36) NOT NULL,
                \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`policy\` longtext NOT NULL,
                \`terms\` longtext NOT NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    }
    async down(queryRunner) {
        await queryRunner.query(`
            DROP TABLE \`policy_and_terms\`
        `);
    }
}
exports.AddTermsAndPolicyModel1733753750177 = AddTermsAndPolicyModel1733753750177;
//# sourceMappingURL=1733753750177-addTermsAndPolicyModel.js.map
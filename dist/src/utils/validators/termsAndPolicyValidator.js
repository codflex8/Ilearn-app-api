"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTermAndPolicyValidator = void 0;
const zod_1 = require("zod");
exports.addTermAndPolicyValidator = zod_1.z.object({
    policy: zod_1.z.string(),
    terms: zod_1.z.string(),
});
//# sourceMappingURL=termsAndPolicyValidator.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPolicyValidator = exports.addTermValidator = void 0;
const zod_1 = require("zod");
exports.addTermValidator = zod_1.z.object({
    terms: zod_1.z.string(),
});
exports.addPolicyValidator = zod_1.z.object({
    policy: zod_1.z.string(),
});
//# sourceMappingURL=termsAndPolicyValidator.js.map
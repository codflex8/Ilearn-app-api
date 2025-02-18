"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appVersionsValidator = exports.appLinksValidator = void 0;
const zod_1 = require("zod");
exports.appLinksValidator = zod_1.z.object({
    androidLink: zod_1.z.string(),
    appleLink: zod_1.z.string(),
});
exports.appVersionsValidator = zod_1.z.object({
    androidVersion: zod_1.z.string(),
    appleVersion: zod_1.z.string(),
});
//# sourceMappingURL=appLinksValidator.js.map
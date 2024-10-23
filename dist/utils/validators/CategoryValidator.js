"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addCategoryValidator = void 0;
const zod_1 = require("zod");
exports.addCategoryValidator = zod_1.z.object({
    name: zod_1.z.string().min(1),
    imageUrl: zod_1.z.string().optional().nullable(),
});
//# sourceMappingURL=CategoryValidator.js.map
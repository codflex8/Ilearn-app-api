"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addBookValidator = void 0;
const zod_1 = require("zod");
exports.addBookValidator = zod_1.z.object({
    name: zod_1.z.string(),
    categoryId: zod_1.z.string(),
    imageUrl: zod_1.z.string().optional().nullable(),
    fileUrl: zod_1.z.string().optional().nullable(),
    link: zod_1.z.string().optional().nullable(),
    content: zod_1.z.string().optional().nullable(),
});
//# sourceMappingURL=BookValidator.js.map
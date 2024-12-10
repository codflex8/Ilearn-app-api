"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setLocalPathValidation = exports.addBookValidator = void 0;
const zod_1 = require("zod");
exports.addBookValidator = zod_1.z.object({
    name: zod_1.z.string(),
    categoryId: zod_1.z.string().optional(),
    localPath: zod_1.z.string().optional().nullable(),
    // imageUrl: z.string().optional().nullable(),
    fileUrl: zod_1.z.string().optional().nullable(),
    link: zod_1.z.string().optional().nullable(),
    content: zod_1.z.string().optional().nullable(),
});
exports.setLocalPathValidation = zod_1.z.object({
    localPath: zod_1.z.string(),
});
//# sourceMappingURL=BookValidator.js.map
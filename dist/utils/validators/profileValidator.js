"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileValidator = void 0;
const zod_1 = require("zod");
const AuthValidator_1 = require("./AuthValidator");
exports.updateProfileValidator = zod_1.z.object({
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    phoneNumber: zod_1.z.string().optional().nullable(),
    birthDate: zod_1.z.string().optional().nullable(),
    gender: zod_1.z.nativeEnum(AuthValidator_1.GenderEnum).optional().nullable(),
    booksGoal: zod_1.z.preprocess((val) => (typeof val === "string" ? parseFloat(val) : val), zod_1.z.number().optional().nullable().default(10)),
    examsGoal: zod_1.z.preprocess((val) => (typeof val === "string" ? parseFloat(val) : val), zod_1.z.number().optional().nullable().default(10)),
    intensePoints: zod_1.z.preprocess((val) => (typeof val === "string" ? parseFloat(val) : val), zod_1.z.number().optional().nullable().default(10)),
});
//# sourceMappingURL=profileValidator.js.map
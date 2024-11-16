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
});
//# sourceMappingURL=profileValidator.js.map
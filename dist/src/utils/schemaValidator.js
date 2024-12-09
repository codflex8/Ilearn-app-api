"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const schemaValidator = (schema, data) => {
    try {
        schema.parse(data);
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const errorMessages = error.errors
                .map((issue) => `${issue.path.join(".")} is ${issue.message}`)
                .join(", ");
            throw new Error(errorMessages);
        }
    }
};
exports.default = schemaValidator;
//# sourceMappingURL=schemaValidator.js.map
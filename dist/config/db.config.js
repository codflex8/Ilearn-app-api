"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dialect = void 0;
require("reflect-metadata");
const dbConfig = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "krzh",
    DB: "ai_learning",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};
exports.dialect = "mysql";
exports.default = dbConfig;
//# sourceMappingURL=db.config.js.map
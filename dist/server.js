"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const app_1 = __importDefault(require("./app"));
const app = (0, express_1.default)();
new app_1.default(app);
const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`listen on ${process.env.PORT || 3000} port`);
});
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err.stack || err);
    server.close(() => {
        console.error(`Shutting down due to unhandled rejection.`);
        process.exit(1);
    });
});
// /usr/local/mysql/data/mysqld.local.pid
//# sourceMappingURL=server.js.map
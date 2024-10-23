"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_router_1 = __importDefault(require("./authentication.router"));
const categories_router_1 = __importDefault(require("./categories.router"));
class Routes {
    constructor(app) {
        app.use("/api/v1/auth", authentication_router_1.default);
        app.use("/api/v1/categories", categories_router_1.default);
    }
}
exports.default = Routes;
//# sourceMappingURL=index.js.map
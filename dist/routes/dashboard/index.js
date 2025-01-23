"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_route_1 = __importDefault(require("./auth.route"));
const home_route_1 = __importDefault(require("./home.route"));
const users_router_1 = __importDefault(require("./users.router"));
const appLinks_router_1 = __importDefault(require("./appLinks.router"));
const authenticate_controller_1 = require("../../controllers/dashboard/authenticate.controller");
class DashboardRoutes {
    constructor(app) {
        app.use("/api/v1/dashboard/auth", auth_route_1.default);
        app.use("/api/v1/dashboard/home", authenticate_controller_1.protectAdmin, home_route_1.default);
        app.use("/api/v1/dashboard/users", authenticate_controller_1.protectAdmin, users_router_1.default);
        app.use("/api/v1/dashboard/app-links", authenticate_controller_1.protectAdmin, appLinks_router_1.default);
    }
}
exports.default = DashboardRoutes;
//# sourceMappingURL=index.js.map
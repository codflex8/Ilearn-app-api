"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authentication_router_1 = __importDefault(require("./authentication.router"));
const categories_router_1 = __importDefault(require("./categories.router"));
const books_router_1 = __importDefault(require("./books.router"));
const profile_router_1 = __importDefault(require("./profile.router"));
const chatbot_router_1 = __importDefault(require("./chatbot.router"));
const quizes_router_1 = __importDefault(require("./quizes.router"));
const bookmarks_router_1 = __importDefault(require("./bookmarks.router"));
const home_router_1 = __importDefault(require("./home.router"));
const archive_router_1 = __importDefault(require("./archive.router"));
const groupsChat_router_1 = __importDefault(require("./groupsChat.router"));
const users_router_1 = __importDefault(require("./users.router"));
const authentication_controller_1 = require("../controllers/authentication.controller");
class Routes {
    constructor(app) {
        app.use("/api/v1/auth", authentication_router_1.default);
        app.use("/api/v1", authentication_controller_1.protect, home_router_1.default);
        app.use("/api/v1", authentication_controller_1.protect, users_router_1.default);
        app.use("/api/v1/archive", authentication_controller_1.protect, archive_router_1.default);
        app.use("/api/v1/categories", authentication_controller_1.protect, categories_router_1.default);
        app.use("/api/v1/books", authentication_controller_1.protect, books_router_1.default);
        app.use("/api/v1/profile", authentication_controller_1.protect, profile_router_1.default);
        app.use("/api/v1/chatbots", authentication_controller_1.protect, chatbot_router_1.default);
        app.use("/api/v1/quizes", authentication_controller_1.protect, quizes_router_1.default);
        app.use("/api/v1/bookmarks", authentication_controller_1.protect, bookmarks_router_1.default);
        app.use("/api/v1/groupschat", authentication_controller_1.protect, groupsChat_router_1.default);
    }
}
exports.default = Routes;
//# sourceMappingURL=index.js.map
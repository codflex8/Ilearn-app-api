"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dataSource_1 = require("./models/dataSource");
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const ErrorMiddleware_1 = require("./middleware/ErrorMiddleware");
const ApiError_1 = __importDefault(require("./utils/ApiError"));
const dotenv_1 = __importDefault(require("dotenv"));
class Server {
    constructor(app) {
        this.config(app);
        this.syncDatabase();
    }
    config(app) {
        dotenv_1.default.config();
        app.use((0, cors_1.default)());
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use((0, morgan_1.default)());
        app.get("/", (req, res, next) => {
            return res.send("hello world");
        });
        new routes_1.default(app);
        app.all("*", (req, res, next) => {
            next(new ApiError_1.default(`Can't find this route: ${req.originalUrl}`, 400));
        });
        app.use(ErrorMiddleware_1.globalError);
    }
    syncDatabase() {
        dataSource_1.dataSource
            .initialize()
            .then(() => {
            console.log("connected to db success");
        })
            .catch((err) => {
            console.error(err.message);
            throw new Error(err);
        });
    }
}
exports.default = Server;
//# sourceMappingURL=app.js.map
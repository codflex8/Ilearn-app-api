"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dataSource_1 = require("./models/dataSource");
const routes_1 = __importDefault(require("./routes"));
const cors_1 = __importDefault(require("cors"));
const ErrorMiddleware_1 = require("./middleware/ErrorMiddleware");
const ApiError_1 = __importDefault(require("./utils/ApiError"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const logger_1 = require("./utils/logger");
class AppServer {
    constructor(app) {
        this.connectDatabase();
        this.config(app);
    }
    config(app) {
        dotenv_1.default.config();
        app.use((0, cors_1.default)());
        app.use(express_1.default.json({ limit: "100mb" }));
        app.use(express_1.default.urlencoded({ limit: "100mb", extended: true }));
        app.use((req, res, next) => {
            logger_1.httpLogger.info("new request", {
                path: req.path,
                body: req.body,
                // headers: req.headers,
                query: req.query,
            });
            next();
        });
        // app.use(morgan());
        app.use("/public", express_1.default.static(path_1.default.join(__dirname, "public")));
        app.get("/", (req, res, next) => {
            return res.send("hello worldddd");
        });
        new routes_1.default(app);
        app.all("*", (req, res, next) => {
            next(new ApiError_1.default(`Can't find this route: ${req.originalUrl}`, 400));
        });
        app.use(ErrorMiddleware_1.globalError);
    }
    connectDatabase() {
        dataSource_1.dataSource
            .initialize()
            .then(() => {
            console.log("data base connected");
        })
            .catch((err) => {
            console.error(err.message);
            throw new Error(err);
        });
    }
}
exports.default = AppServer;
//# sourceMappingURL=app.js.map
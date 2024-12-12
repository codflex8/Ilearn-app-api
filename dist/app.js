"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const i18next_1 = __importDefault(require("i18next"));
const i18next_fs_backend_1 = __importDefault(require("i18next-fs-backend"));
const i18next_http_middleware_1 = __importDefault(require("i18next-http-middleware"));
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
        app.use("/public", express_1.default.static(path_1.default.join(__dirname, "public")));
        i18next_1.default
            .use(i18next_fs_backend_1.default) // Connects the file system backend
            .use(i18next_http_middleware_1.default.LanguageDetector) // Enables automatic language detection
            .init({
            backend: {
                loadPath: path_1.default.join(process.cwd(), "src/locales", "{{lng}}", "{{ns}}.json"), // Path to translation files
            },
            detection: {
                order: ["header"], // Detect language from HTTP headers
                caches: false, // Disable caching if you don't want cookies or query strings involved
            },
            fallbackLng: "en", // Default language when no language is detected
            preload: ["en", "ar"], // Preload these languages at startup
        });
        dotenv_1.default.config();
        app.use(i18next_http_middleware_1.default.handle(i18next_1.default));
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
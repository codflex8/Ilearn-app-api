"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalError = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const logger_1 = require("../utils/logger");
const sendErrorForDev = (err, res) => res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
});
//   location / {
//     # First attempt to serve request as file, then
//     # as directory, then fall back to displaying a 404.
//      proxy_pass http://localhost:3000; #whatever port your app runs>
// proxy_http_version 1.1;
// proxy_set_header Upgrade $http_upgrade;
// proxy_set_header Connection "Upgrade";
// proxy_set_header Host $host;
// proxy_set_header X-Real-IP $remote_addr;
// proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
// proxy_set_header X-Forwarded-Proto $scheme;
// proxy_cache_bypass $http_upgrade;
// proxy_read_timeout 60s;
// proxy_connect_timeout 60s;
// proxy_send_timeout 60s;
// client_max_body_size 50M;
// }
const sendErrorForProd = (err, res) => res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
});
const handleJwtInvalidSignature = () => new ApiError_1.default("Invalid token, please login again..", 401);
const handleJwtExpired = () => new ApiError_1.default("Expired token, please login again..", 401);
const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    logger_1.httpLogger.error(err.message, { error: err.stack });
    if (process.env.NODE_ENV === "development") {
        sendErrorForDev(err, res);
    }
    else {
        if (err.name === "JsonWebTokenError")
            err = handleJwtInvalidSignature();
        if (err.name === "TokenExpiredError")
            err = handleJwtExpired();
        sendErrorForProd(err, res);
    }
};
exports.globalError = globalError;
//# sourceMappingURL=ErrorMiddleware.js.map
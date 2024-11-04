"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalError = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const sendErrorForDev = (err, res) => res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
});
const sendErrorForProd = (err, res) => res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
});
const handleJwtInvalidSignature = () => new ApiError_1.default("Invalid token, please login again..", 401);
const handleJwtExpired = () => new ApiError_1.default("Expired token, please login again..", 401);
const globalError = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
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
"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const { combine, timestamp, json, printf, label, colorize } = winston_1.default.format;
const timestampFormat = "MMM-DD-YYYY HH:mm:ss";
winston_1.default.addColors({
    error: "bold red",
    warn: "yellow",
    info: "green",
    debug: "blue",
});
exports.httpLogger = winston_1.default.createLogger({
    format: combine(
    // label(),
    timestamp({ format: timestampFormat }), colorize({ level: true, message: true }), printf((_a) => {
        var { level, message, label, timestamp } = _a, data = __rest(_a, ["level", "message", "label", "timestamp"]);
        return `[${timestamp}] ${level} : ${message} stack:${JSON.stringify(
        //(${label})
        data)}`;
    })),
    transports: [new winston_1.default.transports.Console()],
});
//# sourceMappingURL=logger.js.map
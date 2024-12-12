"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const typeorm_1 = require("typeorm");
const db_config_1 = __importDefault(require("../config/db.config"));
const path_1 = __importDefault(require("path"));
exports.dataSource = new typeorm_1.DataSource({
    host: db_config_1.default.HOST,
    database: db_config_1.default.DB,
    username: db_config_1.default.USER,
    password: db_config_1.default.PASSWORD,
    port: Number(db_config_1.default.port),
    // pool: { ...dbConfig.pool },
    extra: {
        connectionLimit: 10, // Number of connections in the pool
    },
    type: "mysql",
    synchronize: false,
    entities: [path_1.default.join(__dirname, "./*.model.{js,ts}")],
    migrations: [path_1.default.join(__dirname, "../migrations/**/*.{js,ts}")],
    subscribers: [path_1.default.join(__dirname, "../subscribers/**/*.{js,ts}")],
    logging: process.env.NODE_ENV === "production" ? false : true,
});
//# sourceMappingURL=dataSource.js.map
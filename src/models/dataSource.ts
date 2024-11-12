import { DataSource } from "typeorm";
import dbConfig from "../config/db.config";
import path from "path";

export const dataSource = new DataSource({
  host: dbConfig.HOST,
  database: dbConfig.DB,
  username: dbConfig.USER,
  password: dbConfig.PASSWORD,
  port: Number(dbConfig.port),
  // pool: { ...dbConfig.pool },
  type: "mysql",
  synchronize: false,
  entities: [path.join(__dirname, "/**/*.model.{js,ts}")],
  migrations: [path.join(__dirname, "../migrations/**/*.{js,ts}")],
  subscribers: [path.join(__dirname, "../subscribers/**/*.{js,ts}")],
  logging: process.env.NODE_ENV === "production" ? false : true,
});

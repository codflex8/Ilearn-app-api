import { DataSource } from "typeorm";
import dbConfig, { dialect } from "../config/db.config";

export const dataSource = new DataSource({
  host: dbConfig.HOST,
  database: dbConfig.DB,
  username: dbConfig.USER,
  password: dbConfig.PASSWORD,
  // pool: { ...dbConfig.pool },
  type: dialect,
  entities: [__dirname + "/**/*.model{.ts,.js}"],
  synchronize: false,
  migrations: ["src/migrations/**/*{.ts,.js}"],
  subscribers: ["src/subscribers/**/*{.ts,.js}"],
  logging: true,
});

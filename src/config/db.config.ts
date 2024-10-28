import "reflect-metadata";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_User,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB,
  pool: {
    max: process.env.Pool_Max,
    min: process.env.Pool_Min,
    acquire: process.env.Pool_Acquire,
    idle: process.env.Pool_Idle,
  },
};

export const dialect = "mysql";

export default dbConfig;

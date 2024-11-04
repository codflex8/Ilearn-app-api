import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_User,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB,
  pool: {
    max: Number(process.env.Pool_Max) || 5,
    min: Number(process.env.Pool_Min) || 0,
    acquire: Number(process.env.Pool_Acquire) || 30000,
    idle: Number(process.env.Pool_Idle) || 10000,
  },
};

export default dbConfig;

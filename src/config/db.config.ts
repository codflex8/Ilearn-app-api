import "reflect-metadata";

const dbConfig = {
  HOST: "localhost",
  USER: "root",
  PASSWORD: "krzh",
  DB: "ai_learning",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

export const dialect = "mysql";

export default dbConfig;

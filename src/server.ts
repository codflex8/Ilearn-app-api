import "reflect-metadata";
import express from "express";
import AppServer from "./app";
const app = express();

new AppServer(app);

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`listen on ${process.env.PORT || 3000} port`);
});
process.on("unhandledRejection", (err: any) => {
  console.error("Unhandled Rejection:", err.stack || err);
  server.close(() => {
    console.error(`Shutting down due to unhandled rejection.`);
    process.exit(1);
  });
});
// /usr/local/mysql/data/mysqld.local.pid

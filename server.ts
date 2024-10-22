import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import Server from "./src/app";
const app = express();

new Server(app);

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`listen on ${process.env.PORT || 3000} port`);
});

process.on("unhandledRejection", (err: Error) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});

// /usr/local/mysql/data/mysqld.local.pid

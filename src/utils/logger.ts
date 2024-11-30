import winston from "winston";

const { combine, timestamp, json, printf, label, colorize } = winston.format;
const timestampFormat = "MMM-DD-YYYY HH:mm:ss";
winston.addColors({
  error: "bold red",
  warn: "yellow",
  info: "green",
  debug: "blue",
});
export const httpLogger = winston.createLogger({
  format: combine(
    // label(),
    timestamp({ format: timestampFormat }),
    colorize({ level: true, message: true }),
    printf(
      ({ level, message, label, timestamp, ...data }) =>
        `[${timestamp}] ${level} : ${message} stack:${JSON.stringify(
          //(${label})
          data
        )}`
    )
  ),
  transports: [new winston.transports.Console()],
});

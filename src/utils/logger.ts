import winston from "winston";

const { combine, timestamp, json, printf } = winston.format;
const timestampFormat = "MMM-DD-YYYY HH:mm:ss";
winston.addColors({
  error: "bold red",
  warn: "yellow",
  info: "green",
  debug: "blue",
});
// Logger for API endpoints
export const httpLogger = winston.createLogger({
  format: combine(
    timestamp({ format: timestampFormat }),
    json(),
    winston.format.colorize({
      colors: {
        error: "bold red",
        warn: "yellow",
        info: "green",
        debug: "blue",
      },
    }),
    printf(({ timestamp, level, message, ...data }) => {
      const response = {
        level,
        timestamp,
        message,
        data,
      };

      return JSON.stringify(response);
    })
  ),
  transports: [new winston.transports.Console()],
});

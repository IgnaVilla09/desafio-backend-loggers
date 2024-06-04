import { dirname } from "path";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import winston from "winston";
import { config } from "./config/config.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const creaHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const validate = (usuario, password) =>
  bcrypt.compareSync(password, usuario.password);

export { __dirname };

const customLevels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
};

export const logger = winston.createLogger({
  levels: customLevels,
  transports: [
    new winston.transports.File({
      level: "fatal",
      filename: "./logs/error.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.prettyPrint()
      ),
    }),
  ],
});

const transportConsole = new winston.transports.Console({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize({
      colors: {
        fatal: "red",
        error: "red",
        warning: "yellow",
        info: "blue",
        http: "cyan",
        debug: "green",
      },
    }),
    winston.format.simple()
  ),
});

const transportInfo = new winston.transports.Console({
  level: "info",
  format: winston.format.combine(
    winston.format.colorize({
      colors: {
        fatal: "red",
        error: "red",
        warning: "yellow",
        info: "blue",
        http: "cyan",
        debug: "green",
      },
    }),
    winston.format.simple()
  ),
});

if (config.MODE != "production") {
  logger.add(transportConsole);
} else {
  logger.add(transportInfo);
}

export const middlog = (req, res, next) => {
  req.logger = logger;
  next();
};

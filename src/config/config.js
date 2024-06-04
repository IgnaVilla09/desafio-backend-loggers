import dotenv from "dotenv";

dotenv.config({
  path: ".env",
  override: true,
});

export const config = {
  SECRET: process.env.SECRET,
  PERSISTENCE: process.env.PERSISTENCE,
  PORT: process.env.PORT || 8080,
  MODE: process.env.MODE || "development",
  MENSAJE: process.env.MENSAJE,
  MONGO_URL: process.env.MONGO_URL,
  DB_NAME: process.env.DB_NAME || "ecommerce",
  PASSWORDMAILING: process.env.PASSAPPGOOGLE,
  EMAIL: process.env.EMAILGOOGLE,
};

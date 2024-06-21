import express from "express";
import mongoose from "mongoose";
import path from "path";
import { Server } from "socket.io";
import { __dirname, logger, middlog } from "./utils.js";
import handlebars from "express-handlebars";
import { initPassport } from "./config/passport.config.js";
import passport from "passport";
import { router as productsRouter } from "./routes/productsRouter.js";
import { router as userRouter } from "./routes/userRouter.js";
import { router as cartRouter } from "./routes/cartRouter.js";
import { router as chatRouter } from "./routes/chatRouter.js";
import { router as loggerRouter } from "./routes/loggerRouter.js";
import { router as sessionRouter } from "./routes/sessionsRouter.js";
import { router as mockingProducts } from "./routes/mockingProducts.js";
import {
  routerView as viewRouter,
  handleRealTimeProductsSocket,
} from "./routes/viewRouter.js";
import { config } from "./config/config.js";
import { handleError } from "./middlewares/handleError.js";
import cookieParser from "cookie-parser";

const PORT = config.PORT;
let io;

const app = express();

const serverHttp = app.listen(PORT, () => {
  logger.debug(`Server escuchando en puerto ${PORT}`);
});

io = new Server(serverHttp);

app.engine(
  "handlebars",
  handlebars.engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
    helpers: {
      gt: function(a, b) { return a > b; },
    },
  })
);

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(middlog);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

initPassport();
app.use(passport.initialize());
app.use(cookieParser("appCoder"));
app.use(express.static(path.join(__dirname, "public")));

// RUTAS DE NAVEGACIÓN

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/user", userRouter);
app.use("/chat", chatRouter(io));
app.use("/mockingproducts", mockingProducts);
app.use("/loggerTest", loggerRouter);
app.use("/", viewRouter);
app.get("*", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.status(405).json({ error: `Error 404 || NOT FOUND` });
});

app.use(handleError);

handleRealTimeProductsSocket(io);

try {
  await mongoose.connect(`${config.MONGO_URL}${config.DB_NAME}`);
  logger.debug("DB Online...!!!", config.MENSAJE);
  logger.info("BIENVENIDO! estamos en nivel: " + config.MODE);
} catch (error) {
  logger.debug("Fallo conexión. Detalle:", error.message);
  logger.info("Intente mas tarde");
}

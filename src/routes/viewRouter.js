import { Router } from "express";
import ProductManagerMongo from "../dao/managersMongo/productManagerMongo.js";
const routerView = Router();
import { auth } from "../middlewares/auth.js";
import viewController from "../controller/view.controller.js";
import { logger } from "../utils.js";

const productManager = new ProductManagerMongo();

function handleRealTimeProductsSocket(io) {
  io.on("connection", async (socket) => {
    logger.debug("Usuario conectado a la WebSocket");
    const products = await productManager.getProduct();
    socket.emit("products", products);
  });
}

routerView.get("/", async (req, res) => {
  res.status(200).render("home", { login: req.session.usuario });
});

routerView.get("/registro", (req, res) => {
  res.status(200).render("registros", { login: req.session.usuario });
});

routerView.get("/login", (req, res) => {
  return res.status(200).render("login", { login: req.session.usuario });
});

routerView.get("/products", auth, viewController.getProduct);

routerView.get("/products/:id", auth, viewController.getProductById);

routerView.get("/realtimeproducts", auth, viewController.realTime);

export { routerView, handleRealTimeProductsSocket };

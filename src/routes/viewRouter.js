import { Router } from "express";
import passport from "passport";
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
  if (req.signedCookies.appToken) {
    return res
      .status(200)
      .render("home", { login: req.signedCookies.appToken });
  } else {
    return res.status(200).render("home");
  }
});

routerView.get("/registro", (req, res) => {
  if (req.signedCookies.appToken) {
    return res
      .status(200)
      .render("registros", { login: req.signedCookies.appToken });
  } else {
    return res.status(200).render("registros");
  }
});

routerView.get("/login", (req, res) => {
  if (req.signedCookies.appToken) {
    return res
      .render("login", { login: req.signedCookies.appToken });
  } else {
    return res.render("login");
  }
});

routerView.get(
  "/products",
  passport.authenticate("jwt", { session: false }),
  auth,
  viewController.getProduct
);

routerView.get(
  "/products/:id",
  passport.authenticate("jwt", { session: false }),
  auth,
  viewController.getProductById
);

routerView.get(
  "/realtimeproducts",
  passport.authenticate("jwt", { session: false }),
  auth,
  viewController.realTime
);

export { routerView, handleRealTimeProductsSocket };

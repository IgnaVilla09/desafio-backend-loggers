import { Router } from "express";
import cartController from "../controller/cart.controller.js";
import { auth, userAuth } from "../middlewares/auth.js";
import ticketController from "../controller/ticket.controller.js";

const router = Router();
// ENVIAR MAIL

router.get("/mail", auth, userAuth, ticketController.sendMail);

// VER CARRITO SEGÚN ID
router.get("/:id", auth, cartController.viewCart);

//Añadir productos al carrito
router.post("/:cid/:pid", auth, userAuth, cartController.addProductCart);

//Eliminar producto del carrito
router.delete(
  "/:cartId/products/:productId",
  auth,
  cartController.removeProductsCart
);

//Eliminar TODOS los productos del carrito
router.delete("/:cartId", auth, cartController.removeAllProducts);

//Actualización de ejemplares del producto en carrito
router.put(
  "/:cartId/products/:productId",
  auth,
  cartController.updateQuantityProduct
);

//Procesar compra

router.get("/:cartId/purchase", auth, userAuth, ticketController.createTicket);

export { router };

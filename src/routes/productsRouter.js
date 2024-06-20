import { Router } from "express";
import productController from "../controller/product.controller.js";
import { auth, adminAuth, premiumAuth } from "../middlewares/auth.js";

const router = Router();

//Muestra de todos los productos
router.get("/", auth, productController.getProduct);

//Muestra de productos según ID
router.get("/:pid", auth, productController.getProductById);

//Creación de productos
router.post("/", auth, premiumAuth, productController.addProduct);

//Actualización de productos según ID elegido
router.put("/:pid", auth, adminAuth, productController.updateProduct);

//Eliminar productos según ID
router.delete("/:pid", auth, premiumAuth, productController.deleteProduct);

export { router };

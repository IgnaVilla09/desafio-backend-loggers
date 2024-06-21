import { cartServices } from "../services/cart.service.js";
import { modeloProductos } from "../dao/models/products.modelo.js";
import { modeloCarrito } from "../dao/models/cart.modelo.js";
import { usuariosModelo } from "../dao/models/usuario.modelo.js";
export default class cartController {
  static getCart = async (req, res) => {
    const cartId = req.params.cid;

    try {
      const cart = await cartServices.getCart(cartId);

      cart.populate({
        path: "products.productId",
        select: "title price description code category stock status",
      });
      if (!cart) {
        res.status(400).json({ error: "Carrito no encontrado" });
        return;
      }
      res.json(cart);
    } catch (error) {
      req.logger.fatal("Error del servidor para obtener el carrito");
      res.status(500).json({
        error: "Error del servidor" + error.message,
      });
    }
  };

  static viewCart = async (req, res) => {
    try {
      const cartId = req.params.id;
      const cart = await modeloCarrito
        .findById(cartId)
        .populate("products")
        .lean();
      if (!cart) {
        return res.status(404).send("El carrito no fue encontrado.");
      }

      const productsWithDetails = await Promise.all(
        cart.products.map(async (product) => {
          const productDetails = await modeloProductos
            .findById(product.productId)
            .lean();

          return {
            ...product,
            title: productDetails.title,
            price: productDetails.price,
            totalPrice: productDetails.price * product.quantity,
          };
        })
      );

      // Cálculo del subtotal
      let subtotal = 0;
      productsWithDetails.forEach((product) => {
        subtotal += product.totalPrice;
      });

      // Actualizar el subtotal en la base de datos
      await modeloCarrito.findByIdAndUpdate(cartId, { subtotal });

      res.render("cart", {
        cart: { ...cart, products: productsWithDetails, subtotal },
      });
    } catch (error) {
      req.logger.fatal("Error al procesar la solicitud de vista del carrito");
      res.status(500).send("Error al procesar la solicitud." + error.message);
    }
  };

  static addProductCart = async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const userId = req.user._id;
    const userGitId = req.user.userID;
    const user = await usuariosModelo.findById(userId);
    const product = await modeloProductos.findById(productId);

    if (userGitId == product.owner) {
      req.logger.fatal("El usuario es el dueño del producto");
      return res
        .status(400)
        .json({ error: "No puedes añadir un producto tuyo al carrito" });
    } else {
      try {
        const addProduct = await cartServices.addProductCart(
          cartId,
          productId
        );
        return res.status(200).json(addProduct);
      } catch (error) {
        req.logger.fatal("Error al añadir producto al carrito");
        res.status(400).json({ error: error.message });
      }
    }

    if (user) {
      if (user.role == "Premium" && userId == product.owner) {
        req.logger.fatal("El usuario es el dueño del producto");
        return res
          .status(400)
          .json({ error: "No puedes añadir un producto tuyo al carrito" });
      } else {
        try {
          const addProduct = await cartServices.addProductCart(
            cartId,
            productId
          );
          res.status(200).json(addProduct);
        } catch (error) {
          req.logger.fatal("Error al añadir producto al carrito");
          res.status(400).json({ error: error.message });
        }
      }
    }
  };

  static removeProductsCart = async (req, res) => {
    const cartId = req.params.cartId;
    const productId = req.params.productId;
    try {
      await cartServices.removeProductsCart(cartId, productId);
      res.json({ message: "Producto eliminado del carrito exitosamente" });
    } catch (error) {
      req.logger.fatal("Error al eliminar el producto del carrito");
      res.status(500).json({
        error: "Error al eliminar el producto del carrito: " + error.message,
      });
    }
  };

  static removeAllProducts = async (req, res) => {
    const cartId = req.params.cartId;
    try {
      await cartServices.removeAllProducts(cartId);
      res.json({
        message:
          "Todos los productos han sido eliminados del carrito exitosamente",
      });
    } catch (error) {
      req.logger.fatal("Error al eliminar todos los productos del carrito");
      res.status(500).json({
        error:
          "Error al eliminar todos los productos del carrito: " + error.message,
      });
    }
  };

  static updateQuantityProduct = async (req, res) => {
    const { cartId, productId } = req.params;
    const { price, quantity } = req.body;

    try {
      await cartServices.updateQuantityProduct(
        cartId,
        productId,
        price,
        quantity
      );
      res.json({
        message: "Cantidad del producto actualizada exitosamente en el carrito",
      });
    } catch (error) {
      req.logger.fatal("Error al actualizar carrito");
      res.status(500).json({
        error:
          "Error al actualizar la cantidad del producto en el carrito: " +
          error.message,
      });
    }
  };
}

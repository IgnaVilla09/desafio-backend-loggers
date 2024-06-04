import { modeloCarrito } from "../models/cart.modelo.js";
import { modeloProductos } from "../models/products.modelo.js";

export class cartManagerMongo {
  async getCart(cartId) {
    try {
      return await modeloCarrito.findById(cartId);
    } catch (error) {
      throw new Error("Error al obtener el carrito: " + error.message);
    }
  }

  async createCartForUser(userId) {
    try {
      const newCart = await modeloCarrito.create({ userId, products: [] });
      return newCart;
    } catch (error) {
      throw new Error("Error al crear el carrito: " + error.message);
    }
  }

  async addProductCart(cartId, productId) {
    try {
      const cart = await modeloCarrito.findById(cartId);
      const product = await modeloProductos.findById(productId);

      if (!cart) {
        throw new Error("Carrito no encontrado con el ID indicado");
      }

      if (product.stock <= 0) {
        throw new Error("Producto sin stock");
      }

      const productExist = cart.products.find((product) =>
        product.productId.equals(productId)
      );

      if (productExist) {
        productExist.quantity++;
      } else {
        cart.products.push({ productId, quantity: 1 });
      }
      product.stock--;
      await product.save();
      await cart.save();
      return cart.products.find((product) =>
        product.productId.equals(productId)
      );
    } catch (error) {
      res.status(400).json({
        error: "Error al agregar el producto al carrito " + error.message,
      });
    }
  }

  async removeProductsCart(cartId, productId) {
    try {
      const cart = await modeloCarrito.findById(cartId);

      if (!cart) {
        throw new Error(`Carrito no encontrado para el ID ${cartId}`);
      }

      const productIndex = cart.products.findIndex((product) =>
        product.productId.equals(productId)
      );

      if (productIndex === -1) {
        throw new Error(`Producto no encontrado en el carrito`);
      }

      const product = await modeloProductos.findById(productId);

      if (!product) {
        throw new Error(`Producto no encontrado para el ID ${productId}`);
      }

      product.stock += cart.products[productIndex].quantity;

      cart.products = cart.products.filter(
        (product) => !product.productId.equals(productId)
      );

      await product.save();
      await cart.save();

      return cart;
    } catch (error) {
      throw new Error(
        "Error al eliminar el producto del carrito: " + error.message
      );
    }
  }

  async removeAllProducts(cartId) {
    try {
      const cart = await modeloCarrito.findById(cartId);

      if (!cart) {
        throw new Error(`Carrito no encontrado para el ID ${cartId}`);
      }

      const productUpdates = cart.products.map(async (product) => {
        const productData = await modeloProductos.findById(product.productId);
        if (productData) {
          productData.stock += product.quantity;
          await productData.save();
        }
      });

      await Promise.all(productUpdates);

      cart.products = [];
      cart.subtotal = 0;

      await cart.save();

      return cart;
    } catch (error) {
      throw new Error(
        "Error al eliminar todos los productos del carrito: " + error.message
      );
    }
  }

  async updateQuantityProduct(cartId, productId, price, updateQuantity) {
    try {
      const cart = await modeloCarrito.findById(cartId);

      if (!cart) {
        throw new Error(`Carrito no encontrado para el ID ${cartId}`);
      }

      const productToUpdate = cart.products.find((product) =>
        product.productId.equals(productId)
      );

      if (!productToUpdate) {
        throw new Error(`Producto no encontrado en el carrito`);
      }

      productToUpdate.quantity = updateQuantity;

      price = price * updateQuantity;

      await cart.save();

      return cart;
    } catch (error) {
      throw new Error(
        "Error al actualizar la cantidad del producto en el carrito: " +
          error.message
      );
    }
  }
}

export default cartManagerMongo;

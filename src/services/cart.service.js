import { cartManagerMongo as cartManager } from "../dao/managersMongo/cartManagerMongo.js";

class cartService {
  constructor(dao) {
    this.cartDAO = dao;
  }

  async getCart(cartId) {
    return await this.cartDAO.getCart(cartId);
  }

  async addProductCart(cartId, productId) {
    return await this.cartDAO.addProductCart(cartId, productId);
  }

  async createCartForUser(userId) {
    return await this.cartDAO.createCartForUser(userId);
  }

  async removeProductsCart(cartId, productId) {
    return await this.cartDAO.removeProductsCart(cartId, productId);
  }

  async removeAllProducts(cartId) {
    return await this.cartDAO.removeAllProducts(cartId);
  }

  async updateQuantityProduct() {
    return await this.cartDAO.updateQuantityProduct(
      cartId,
      productId,
      updateQuantity
    );
  }
}

export const cartServices = new cartService(new cartManager());

import { productManagerMongo as productManager } from "../dao/managersMongo/productManagerMongo.js";

class productService {
  constructor(dao) {
    this.productDAO = dao;
  }

  async getProductById(productId) {
    return await this.productDAO.getProductById(productId);
  }

  async addProduct(
    title,
    description,
    owner,
    code,
    price,
    stock,
    category,
    thumbnails,
    status
  ) {
    return await this.productDAO.addProduct(
      title,
      description,
      owner,
      code,
      price,
      stock,
      category,
      thumbnails,
      status
    );
  }

  async updateProduct(productId, updatedFields) {
    return await this.productDAO.updateProduct(productId, updatedFields);
  }

  async deleteProduct(productId) {
    return await this.productDAO.deleteProduct(productId);
  }
}

export const productServices = new productService(new productManager());

import { modeloCarrito } from "../models/cart.modelo.js";
import { modeloProductos } from "../models/products.modelo.js";

export class productManagerMongo {
  async getProduct(limit) {
    try {
      const products = await modeloProductos.find().limit(limit);
      return products;
    } catch (error) {
      throw new Error("Error al obtener los productos");
    }
  }

  async getProductById(id) {
    try {
      const product = await modeloProductos.findById({ _id: id });
      return product;
    } catch (error) {
      throw new Error("Error al encontrar el producto en DB: " + error.message);
    }
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
    try {
      const newProduct = await modeloProductos.create({
        title: title,
        description: description,
        price: price,
        thumbnails: thumbnails,
        owner: owner,
        code: code,
        stock: stock,
        status: status,
        category: category,
      });
      return newProduct;
    } catch (error) {
      throw new Error(
        "Error al agregar el producto a MongoDB: " + error.message
      );
    }
  }

  async deleteProduct(id) {
    try {
      const deletedProduct = await modeloProductos.findOneAndDelete({
        _id: id,
      });
      if (!deletedProduct) {
        throw new Error("Producto no encontrado para eliminar");
      }else {
        // ELIMINAR EL PRODUCTO TAMBIEN EN EL CARRITO

        await modeloCarrito.updateMany(
          { "products.productId": id },
          { $pull: { products: { productId: id } } }
        );

        console.log("Producto eliminado con éxito");
      }
      return deletedProduct;
    } catch (error) {
      throw new Error("Error al eliminar el producto" + error.message);
    }
  }

  async updateProduct(id, updatedFields) {
    try {
      const updatedProduct = await modeloProductos.findOneAndUpdate(
        { _id: id },
        updatedFields,
        { new: true }
      );
      if (!updatedProduct) {
        throw new Error("Producto no encontrado para actualizar");
      }
      return updatedProduct;
    } catch (error) {
      throw new Error(
        "Error al actualizar el producto en MongoDB: " + error.message
      );
    }
  }
}

export default productManagerMongo;

import productManagerMongo from "../dao/managersMongo/productManagerMongo.js";
import { modeloProductos } from "../dao/models/products.modelo.js";

const productManager = new productManagerMongo();

export default class viewController {
  static getProduct = async (req, res) => {
    let { pagina } = req.query;
    if (!pagina) {
      pagina = 1;
    }

    let {
      docs: products,
      totalPages,
      prevPage,
      nextPage,
      hasPrevPage,
      hasNextPage,
    } = await modeloProductos.paginate(
      {},
      { limit: 10, page: pagina, lean: true }
    );

    let usuario = req.user;

    res.status(200).render("products", {
      usuario,
      products,
      totalPages,
      prevPage,
      nextPage,
      hasPrevPage,
      hasNextPage,
    });
  };

  static getProductById = async (req, res) => {
    try {
      const productId = req.params.id;
      const product = await modeloProductos.findById(productId).lean();
      if (!product) {
        return res.status(404).send("El producto no fue encontrado.");
      }
      res.render("productView", { product });
    } catch (error) {
      req.logger.fatal("Error al procesar solicitud, búsqueda por ID");
      res.status(500).send("Error al procesar la solicitud.");
    }
  };

  static realTime = async (req, res) => {
    const products = await productManager.getProduct();
    res.status(200).render("realtimeproducts", { products });
  };
}

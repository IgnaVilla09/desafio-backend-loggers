import { modeloProductos } from "../dao/models/products.modelo.js";
import { usuariosModelo } from "../dao/models/usuario.modelo.js";
import { productServices } from "../services/product.service.js";
import CustomError from "../utils/CustomErrors.js";
import { ERRORES } from "../utils/errors.js";
import { args } from "../utils/postErrors.js";

export default class productController {
  static getProduct = async (req, res) => {
    try {
      const { page = 1, limit = 5, sort = "asc" } = req.query;
      const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: { price: sort === "asc" ? 1 : -1 },
      };
      const products = await modeloProductos.paginate({}, options);
      const jsonProducts = JSON.stringify(products, null, 2);
      res.setHeader("Content-Type", "application/json");
      res.end(jsonProducts);
    } catch (error) {
      req.logger.fatal("Error al obtener listado de productos");
      res.status(500).json({ error: error.message });
    }
  };

  static getProductById = async (req, res) => {
    const productId = req.params.pid;
    try {
      const product = await productServices.getProductById(productId);
      res.json(product);
    } catch (error) {
      req.logger.fatal("Producto no encontrado con ID");
      res.status(404).json({ error: "Producto no encontrado" + error.message });
    }
  };

  static addProduct = async (req, res, next) => {
    const {
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails,
      status,
    } = req.body;

    let owner = req.user._id

    console.log(owner)
   
    const ownerAdmin = await usuariosModelo.findById(owner)

    if(ownerAdmin.role == "admin") {
      owner = "admin"
    }


    console.log(owner)

    if (!title || !code || !price || !stock) {
      try {
        CustomError.createError({
          name: "Error al crear producto",
          cause: args(req.body),
          message: "Complete las propiedades obligatorias.",
          code: ERRORES["ARGUMENTOS INVALIDOS"],
        });
      } catch (error) {
        req.logger.fatal("Error al crear producto, propiedades obligatorias");
        return next(error);
      }
    }

    try {
      const newProduct = await productServices.addProduct(
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
      res.redirect("/realtimeproducts");
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  static updateProduct = async (req, res) => {
    const productId = req.params.pid;
    const updatedFields = req.body;
    try {
      const updatedProduct = await productServices.updateProduct(
        productId,
        updatedFields
      );
      res.json(updatedProduct);
    } catch (error) {
      req.logger.fatal("Producto no encontrado para actualizar");
      res.status(404).json({ error: "Producto no encontrado" });
    }
  };

  static deleteProduct = async (req, res) => {
    try {
      const productId = req.params.pid;
      const product = await productServices.getProductById(productId);
      
      let userRole = req.user.role
      let userId = req.user._id  


      if(userRole == "admin"){
        try {
          await productServices.deleteProduct(productId)
          res.status(200).json({message:"Producto eliminado con éxito"})
        } catch (error) {
          req.logger.fatal("Producto no encontrado para eliminar")
          res.status(400).json({error:`Producto no encontrado`})
        }
      } else {
        if(userRole == "Premium" && product.owner == userId){
          try {
            await productServices.deleteProduct(productId);
            res.status(200).json({message:"Producto eliminado con éxito"});
          } catch (error) {
            req.logger.fatal("Producto no encontrado para eliminar");
            res.status(404).json({ error: "Producto no encontrado" });
          }
        }else {
          res.status(401).json({ error: "No tiene permisos para eliminar este producto" });
        };
      }
    } catch (error) {
      req.logger.fatal("Error al eliminar producto" + error.message);
      res.status(400).json({error:`Intente nuevamente`})
    }
  
  }
}

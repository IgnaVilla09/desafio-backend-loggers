import { logger } from "../utils.js";
import { ERRORES } from "../utils/errors.js";

export const handleError = (error, req, res, next) => {
  console.log("******************");
  logger.fatal(`${error.cause ? error.cause : error.stack}`);
  console.log("******************");

  switch (error.code) {
    case ERRORES["ARGUMENTOS INVALIDOS"]:
      res.setHeader("Content-Type", "application/json");
      return res
        .status(ERRORES["ARGUMENTOS INVALIDOS"])
        .json({ error: `${error.name}`, detalle: error.message });

    case ERRORES.AUTENTICACION:
      res.setHeader("Content-Type", "application/json");
      return res
        .status(ERRORES.AUTENTICACION)
        .json({ error: "Error de autenticación", detalle: error.message });

    case ERRORES.AUTORIZACION:
      res.setHeader("Content-Type", "application/json");
      return res
        .status(ERRORES.AUTORIZACION)
        .json({ error: "Error de autorización", detalle: error.message });

    case ERRORES["NOT FOUND"]:
      res.setHeader("Content-Type", "application/json");
      return res
        .status(ERRORES["NOT FOUND"])
        .json({ error: "Recurso no encontrado", detalle: error.message });

    case ERRORES["METODO NO REGISTRADO"]:
      res.setHeader("Content-Type", "application/json");
      return res
        .status(ERRORES["METODO NO REGISTRADO"])
        .json({ error: "Método no registrado", detalle: error.message });

    case ERRORES["ERROR INTERNO DEL SERVER"]:
      res.setHeader("Content-Type", "application/json");
      return res
        .status(ERRORES["ERROR INTERNO DEL SERVER"])
        .json({ error: "Error interno del servidor", detalle: error.message });

    default:
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error:
          "Error inesperado en el servidor - Intente más tarde, o contacte a su administrador",
        detalle: `${error.message}`,
      });
  }
};

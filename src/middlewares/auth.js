import jwt from "jsonwebtoken";
import { SECRET, logger } from "../utils.js";
import CustomError from "../utils/CustomErrors.js";
import { ERRORES } from "../utils/errors.js";

export const auth = async (req, res, next) => {
  let token = null;

  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.redirect("/login?mensaje=No hay token de autenticación");
  }

  try {
    let usuario = jwt.verify(token, SECRET);

    req.user = usuario;
  } catch (error) {
    logger.fatal("Error al verificar la autenticación:", error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
      detail: error.message,
    });
  }

  next();
};

export const adminAuth = async (req, res, next) => {
  let token = null;

  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      error: "No se proporcionó un token de autenticación",
    });
  }

  try {
    let usuario = jwt.verify(token, SECRET);

    if (usuario.role !== "admin") {
      throw new CustomError({
        name: "Error de autenticación",
        cause: "Autenticación",
        message: "Usuario sin permisos para ejecutar método",
        code: ERRORES.AUTORIZACION,
      });
    }
  } catch (error) {
    logger.fatal("Error al verificar la autenticación:", error);
    return res.status(403).json({
      error: "No tiene los privilegios necesarios para acceder a esta función",
    });
  }

  next();
};

export const userAuth = async (req, res, next) => {
  let token = null;

  if (req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      error: "No se proporcionó un token de autenticación",
    });
  }

  try {
    let usuario = jwt.verify(token, SECRET);

    if (usuario.role !== "usuario") {
      throw new CustomError({
        name: "Error de autenticación",
        cause: "Autenticación",
        message: "Usuario sin permisos para ejecutar método",
        code: ERRORES.AUTORIZACION,
      });
    }
  } catch (error) {
    logger.fatal("Error al verificar la autenticación:", error);
    return res.status(403).json({
      error: "No tiene los privilegios necesarios para acceder a esta función",
    });
  }

  next();
};

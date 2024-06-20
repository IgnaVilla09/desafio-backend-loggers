import jwt from "jsonwebtoken";
import { logger } from "../utils.js";
import CustomError from "../utils/CustomErrors.js";
import { ERRORES } from "../utils/errors.js";
import { config } from "../config/config.js";

export const auth = async (req, res, next) => {
  let token = null;

  if (req.signedCookies.appToken) {
    token = req.signedCookies.appToken;
  }

  if (!token) {
    logger.fatal("No se encontró token de autenticación");
  }


  try {
    let usuario = jwt.verify(token, config.SECRET);
    req.user = usuario;
    next();
  } catch (error) {
    logger.fatal("Error al verificar la autenticación:", error);
    res.setHeader("Content-Type", "application/json");
    return res.status(500).json({
      error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
    });
  }
};

export const adminAuth = async (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    try {
      CustomError.createError({
        name: "Error de autenticación",
        cause: "Autenticación",
        message: "Usuario sin permisos para ejecutar método",
        code: ERRORES.AUTORIZACION,
      });
    } catch (error) {
      return next(error);
    }
  }
  next();
};

export const userAuth = async (req, res, next) => {
  if (req.user.role !== "Premium" && req.user.role !== "usuario") {
    req.logger.fatal("Administrador sin autorización de ejecutar función");
    return res.status(403).json({
      error: `No tiene los privilegios necesarios para acceder a esta función`,
    });
  }
  next();
};

export const premiumAuth = async (req, res, next) => { 
  if (req.user.role !== "Premium" && req.user.role !== "admin"  ) {
    req.logger.fatal("Usuario sin autorización de ejecutar función");
    return res.status(403).json({
      error: `No tiene los privilegios necesarios para acceder a esta función. Usuario: ${req.user.role}` ,
    });
  }
  next();
}

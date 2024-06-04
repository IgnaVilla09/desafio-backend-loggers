import { usuariosModelo } from "../dao/models/usuario.modelo.js";
import { logger } from "../utils.js";
import CustomError from "../utils/CustomErrors.js";
import { ERRORES } from "../utils/errors.js";

export const auth = async (req, res, next) => {
  if (!req.session.usuario) {
    return res.redirect("/login");
  }
  try {
    const usuario = await usuariosModelo.findById(req.session.usuario._id);
    if (!usuario) {
      return res.redirect("/login");
    }
    req.usuario = usuario;
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
  if (!req.session.usuario || req.session.usuario.role !== "admin") {
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
  if (!req.session.usuario || req.session.usuario.role !== "usuario") {
    req.logger.fatal("Administrador sin autorización de ejecutar función");
    return res.status(403).json({
      error: `No tiene los privilegios necesarios para acceder a esta función`,
    });
  }
  next();
};

import { Router } from "express";
import { userAuth } from "../middlewares/auth.js";
import { logger } from "../utils.js";

export const router = (io) => {
  const router = Router();

  io.on("connection", (socket) => {
    logger.debug(`Se conecto un cliente con ID ${socket.id}`);
    let mensajes = [];
    let usuarios = [];
    socket.on("presentation", (nombre) => {
      usuarios.push({ id: socket.id, nombre });
      socket.emit("historial", mensajes);
      socket.broadcast.emit("nuevoUsuario", nombre);
    });

    socket.on("nuevoMensaje", (nombre, mensaje) => {
      mensajes.push({ nombre, mensaje });
      io.emit("conversacion", nombre, mensaje);
    });

    socket.on("disconnect", () => {
      let usuario = usuarios.find((u) => u.id === socket.id);
      if (usuario) {
        socket.broadcast.emit("usuarioDesconectado", usuario.nombre);
      }
    });
  });

  router.get("/", userAuth, (req, res) => {
    res.status(200).render("chat");
  });

  return router;
};

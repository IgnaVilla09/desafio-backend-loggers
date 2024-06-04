import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  // EN MODO DEVELOPMENT SE MOSTRARA TODO ESTO Y LO DE PRODUCTION

  req.logger.debug("Esta es una linea de prueba de debug");
  req.logger.http("Esto es una linea http de prueba");

  //EN MODO PRODUCTION SOLO SE MOSTRARA ESTO
  req.logger.info("Esto es una linea de prueba info");
  req.logger.warning("Esto es una linea de warning de prueba");
  req.logger.error("Esto es una linea de error de prueba");
  req.logger.fatal("Esto es el error FATAL-CRITICAL");

  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ payload: "Revisar Terminal" });
});

export { router };

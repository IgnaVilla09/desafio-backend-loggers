import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import { usuariosModelo } from "../dao/models/usuario.modelo.js";
import { UsuarioDTO } from "../dto/usuarioDTO.js";
import { config } from "../config/config.js";
export const router = Router();

//Registro
router.get("/errorRegistro", (req, res) => {
  res.redirect("/registro?mensaje=Error en registro");
});

router.post(
  "/registro",
  passport.authenticate("registro", {
    failureRedirect: "/api/sessions/errorRegistro",
    session: false,
  }),
  async (req, res) => {
    return res.redirect("/registro?mensaje=registro correcto :D");
  }
);

//Login normal
router.get("/errorLogin", (req, res) => {
  res.redirect("/login?mensaje=Error en login");
});

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/sessions/errorLogin",
    session: false,
  }),
  async (req, res) => {
    let usuario = req.user; //Obtenemos el user del middleware del passport
    usuario = { ...usuario };
    delete usuario.password;
    let token = jwt.sign(usuario, config.SECRET, { expiresIn: "1h" });

    res.cookie("appToken", token, {
      maxAge: 1000 * 60 * 60,
      signed: true,
      httpOnly: true,
    });
    res.setHeader("Content-Type", "application/json");
    return res.redirect("/products");
  }
);

//Login con github
router.get("/errorGithub", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  return res.status(500).json({
    error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
    detalle: "Fallo en conexión con github",
  });
});

router.get(
  "/github",
  passport.authenticate("jwt", { session: false }),
  passport.authenticate("github"),
  (req, res) => {}
);

router.get(
  "/authGitHub",
  passport.authenticate("github", {
    failureRedirect:
      "/api/sessions/errorGithub?mensaje=Error en autenticación con github",
  }),
  (req, res) => {
    res.setHeader("Content-Type", "application/json");
    return res.redirect("/products");
  }
);

//Logout
router.get("/logout", (req, res) => {
  res.clearCookie("appToken");
  return res.redirect("/");
});

//Current
router.get("/current", async (req, res) => {
  try {
    const userId = req.user._id;

    const usuario = await usuariosModelo.findById(userId);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    let usuarioDTO = new UsuarioDTO(usuario); // Mandamos usuarioDTO para evitar enviar información innecesaria
    res.json(usuarioDTO);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

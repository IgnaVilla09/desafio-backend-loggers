import { Router } from "express";
import passport from "passport";
import { usuariosModelo } from "../dao/models/usuario.modelo.js";
import { UsuarioDTO } from "../dto/usuarioDTO.js";
export const router = Router();

//Registro
router.get("/errorRegistro", (req, res) => {
  res.redirect("/registro?mensaje=Error en registro");
});

router.post(
  "/registro",
  passport.authenticate("registro", {
    failureRedirect: "/api/sessions/errorRegistro",
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
  }),
  async (req, res) => {
    let usuario = req.user; //Obtenemos el user del middleware del passport
    usuario = { ...usuario };
    delete usuario.password;
    req.session.usuario = usuario;
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

router.get("/github", passport.authenticate("github"), (req, res) => {});

router.get(
  "/authGitHub",
  passport.authenticate("github", {
    failureRedirect:
      "/api/sessions/errorGithub?mensaje=Error en autenticación con github",
  }),
  (req, res) => {
    req.session.usuario = req.user;

    res.setHeader("Content-Type", "application/json");
    return res.redirect("/products");
  }
);

//Logout
router.get("/logout", (req, res) => {
  req.session.destroy((e) => {
    if (e) {
      res.setHeader("Content-Type", "application/json");
      return res.status(500).json({
        error: `Error inesperado en el servidor - Intente más tarde, o contacte a su administrador`,
        detalle: `${e.message}`,
      });
    }
  });

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

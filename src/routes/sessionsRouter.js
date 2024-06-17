import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { creaHash } from "../utils.js";
import {transporter } from "../config/mailing.config.js";
import cookieParser from "cookie-parser";
import { usuariosModelo } from "../dao/models/usuario.modelo.js";
import { UsuarioDTO } from "../dto/usuarioDTO.js";
import { config } from "../config/config.js";
import { UsuariosManagerMongo } from "../dao/managersMongo/usuariosManager.js";

const usuariosManager = new UsuariosManagerMongo()

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
  passport.authenticate("github"),
  (req, res) => {}
);

router.get(
  "/authGitHub",
  passport.authenticate("github", {
    failureRedirect:
      "/api/sessions/errorGithub?mensaje=Error en autenticación con github",
      session: false,}),
  (req, res) => {

  try {
      let payload = { userID: req.user.id, email: req.user.email, role: req.user.role, profileGithub: req.user.profileGithub.displayName }

      let token = jwt.sign(payload, config.SECRET, { expiresIn: "1h" });

      res.cookie("appToken", token, {
        maxAge: 1000 * 60 * 60,
        signed: true,
        httpOnly: true,
      }); 
  } catch (error) {
      fatal.error(error);
  }
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
router.get("/current", 
  passport.authenticate("jwt", { session: false }), async (req, res) => {
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

router.get("/password-reset", (req, res) => {
  res.render("password-reset");
});

// Send password reset token
router.post("/sendTokenPassword", async (req, res) => {
  try {

    let emailUser = req.body.email

    // const usuario = await usuariosManager.getBy(emailUser);

    // if (!usuario) {
    //   return res.status(404).json({ message: "Usuario no encontrado" });
    // }

    // console.log(usuario)

    const token = jwt.sign({ email: emailUser }, config.SECRET, { expiresIn: "1h" });

    const mailOptions = {
      from: `${config.EMAIL}`,
      to: emailUser,
      subject: "Recuperación de contraseña",
      html: `<a href="http://localhost:8080/api/sessions/reset-password?email=${emailUser}&token=${token}">Click aquí para recuperar tu contraseña</a>`,
      attachments: [],
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Token de recuperación de contraseña enviado" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset password
router.get("/reset-password", (req, res) => {
  
  //extraer de params el token y el email
  const token = req.query.token;
  const email = req.query.email;

  jwt.verify(token, config.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token inválido" });
    }
    res.render("new-password", { token, email });
  });
});

//Actualizacion de contraseña en DB

router.post("/update-password", async (req, res) => {
  let password = req.body.password
  let userEmail = req.body.email

  password = creaHash(password);
  
  try {
  //actualizar password en DB
  const UserUpdate = usuariosManager.update({ email: userEmail }, { password: password });
  res.redirect("/login")
  } catch (error) {
    req.logger.fatal("Usuario no encontrado para actualizar");
    res.status(404).json({ error: "Usuario no encontrado" });
  }

})
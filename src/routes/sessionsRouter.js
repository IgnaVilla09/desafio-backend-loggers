import { Router } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";import {transporter } from "../config/mailing.config.js";
import cookieParser from "cookie-parser";
import {auth, premiumAuth} from "../middlewares/auth.js";
import { usuariosModelo } from "../dao/models/usuario.modelo.js";
import { UsuarioDTO, UsuarioGitDTO } from "../dto/usuarioDTO.js";
import { config } from "../config/config.js";
import { UsuariosManagerMongo } from "../dao/managersMongo/usuariosManager.js";
import { validate } from "../utils.js";

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
  (req, res, next) => {
    passport.authenticate("login", (err, user, info) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }
      if (!user) {
        return res.status(401).json({ error: "Contraseña o email incorrectos" });
      }
      req.user = user;
      next();
    })(req, res, next);
  },
  async (req, res) => {
    try {
      let usuario = req.user;

      usuario = { ...usuario };
      delete usuario.password;


      let token = jwt.sign(usuario, config.SECRET, { expiresIn: "1h" });

      res.cookie("appToken", token, {
        maxAge: 1000 * 60 * 60,
        signed: true,
        httpOnly: true,
      });

      return res.status(200).json({ message: "Login successful" });

    } catch (error) {
      res.setHeader('Content-Type','application/json');
      return res.status(400).json({error:`Error en login: ${error}`})
    }
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

    const user = req.user._id;
    const userId = req.user.userID;

    if(user) {
      try {
        const usuario = await usuariosModelo.findById(user)

        if(!usuario){
          return res.status(404).json({ message: "Usuario no encontrado" });
        }

        let usuarioDTO = new UsuarioDTO(usuario);
        res.json(usuarioDTO);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }

    if (userId){
      try {
        const usuario = await usuariosModelo.findById(userId);
    
        if (!usuario) {
          return res.status(404).json({ message: "Usuario de git no encontrado" });
        }
    
        let usuarioDTO= new UsuarioGitDTO(usuario);
        
         res.json(usuarioDTO);
        
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }
  
});


// RECUPERACION DE CONTRASEÑA

// Renderizar formulario de recuperación de contraseña
router.get("/password-reset", (req, res) => {
  res.render("password-reset");
});


//Envio token por mail
router.post("/sendTokenPassword", async (req, res) => {
  try {

    let emailUser = req.body.email

    const usuario = await usuariosManager.getByEmail(emailUser);

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }


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

// Renderizar inputs de nueva contraseña
router.get("/reset-password", (req, res) => {
  
  //extraer de params el token y el email
  const token = req.query.token;
  const email = req.query.email;

  jwt.verify(token, config.SECRET, (err, decoded) => {

    if (err) {
      return res.redirect("/api/sessions/password-reset?mensaje=Token invalido o expirado");
    }

    res.render("new-password", { token, email });
  });
});

//Actualizacion de contraseña en DB

router.post("/update-password", async (req, res) => {
  let newPassword = req.body.password;
  let userEmail = req.body.email;

  try {
    // Actualizar password en la base de datos
    const updatedUser = await usuariosManager.update({ email: userEmail }, { password: newPassword });
    
    // Aquí puedes enviar una respuesta si es necesario
    res.status(200).json({ message: "Contraseña actualizada exitosamente" });
    
  } catch (error) {
    // Manejo de errores
    console.error("Error al actualizar la contraseña:", error.message);
    res.status(400).json({ error: error.message }); // Devuelve el error al frontend
  }
});
import passport from "passport";
import github from "passport-github2";
import local from "passport-local";
import { UsuariosManagerMongo } from "../dao/managersMongo/usuariosManager.js";
import { creaHash, validate } from "../utils.js";
import { usuariosModelo } from "../dao/models/usuario.modelo.js";
import cartManagerMongo from "../dao/managersMongo/cartManagerMongo.js";

const usuariosMDB = new UsuariosManagerMongo();
const CartManagerMDB = new cartManagerMongo();

export const initPassport = () => {
  //Estrategia Registro
  passport.use(
    "registro",
    new local.Strategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async function (req, username, password, done) {
        try {
          let { nombre, apellido, age, email, role } = req.body;

          if (!nombre || !apellido || !age || !email) {
            return done(null, false);
          }

          if (age < 18) {
            return done(null, false);
          }

          const isAdmin =
            email === "adminCoder@coder.com" && password === "adminCod3r123";

          let assignedRole = isAdmin ? "admin" : role || "usuario";

          let usuarioExists = await usuariosMDB.getBy({ email });

          if (usuarioExists) {
            return done(null, false);
          }

          password = creaHash(password);

          let nuevoUsuario = await usuariosMDB.create({
            nombre,
            apellido,
            email,
            age,
            password,
            role: assignedRole,
          });

          const userId = nuevoUsuario._id;

          const newCart = await CartManagerMDB.createCartForUser(userId);
          await usuariosMDB.update({ _id: userId }, { cartId: newCart._id });

          return done(null, nuevoUsuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );
  //Estrategia Login
  passport.use(
    "login",
    new local.Strategy(
      {
        usernameField: "email",
        passReqToCallback: true,
      },
      async function (req, username, password, done) {
        try {
          let { email } = req.body;
          let usuario = await usuariosMDB.getBy({ email });
          if (!usuario) {
            return done(null, false);
          }

          if (!validate(usuario, password)) {
            return done(null, false);
          }

          return done(null, usuario);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Estrategia Login Github
  passport.use(
    "github",
    new github.Strategy(
      {
        clientID: "Revisar .txt",
        clientSecret: "f30207274e987425cf8ad0283cb9c3f091ec70ae",
        callbackURL: "http://localhost:8080/api/sessions/authGitHub",
      },
      async function (accessToke, refreshToken, profile, done) {
        try {
          let nombre = profile._json.username;
          let email = profile._json.email;

          let usuario = await usuariosModelo.findOne({ email });

          if (!usuario) {
            usuario = await usuariosModelo.create({
              nombre,
              email,
              profileGithub: profile,
            });
          }

          done(null, usuario);
        } catch (error) {
          done(error);
        }
      }
    )
  );
  // SESSION GUARDADAS
  passport.serializeUser((usuario, done) => {
    return done(null, usuario._id);
  });

  passport.deserializeUser(async (id, done) => {
    let usuario = await usuariosMDB.getBy({ _id: id });
    return done(null, usuario);
  });
};

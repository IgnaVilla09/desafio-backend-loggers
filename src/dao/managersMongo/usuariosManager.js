import { usuariosModelo } from "../models/usuario.modelo.js";
import bcrypt from "bcrypt";
export class UsuariosManagerMongo {
  async create(usuario) {
    let nuevoUsuario = await usuariosModelo.create(usuario);
    return nuevoUsuario.toJSON();
  }

  async getBy(filtro) {
    return await usuariosModelo.findOne(filtro).lean();
  }

  async getByEmail(email) {
    return await usuariosModelo.findOne({
      email: email,
    }).lean();}

  async update(query, newData) {
    try {
      const existingUser = await usuariosModelo.findOne(query);
      if (!existingUser) {
        throw new Error("Usuario no encontrado");
      }

      const isSamePassword = await bcrypt.compare(newData.password, existingUser.password);
      if (isSamePassword) {
        throw new Error("La password nueva es igual a la anterior, por favor ingrese una nueva diferente");
      }

      const hashedPassword = await bcrypt.hash(newData.password, 10);
      newData.password = hashedPassword;

      const updatedUser = await usuariosModelo.findOneAndUpdate(
        query,
        newData,
        { new: true }
      );
      return updatedUser;
    } catch (error) {
      throw new Error("Error al actualizar el usuario: " + error.message);
    }
  }
}

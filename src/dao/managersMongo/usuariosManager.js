import { usuariosModelo } from "../models/usuario.modelo.js";

export class UsuariosManagerMongo {
  async create(usuario) {
    let nuevoUsuario = await usuariosModelo.create(usuario);
    return nuevoUsuario.toJSON();
  }

  async getBy(filtro) {
    return await usuariosModelo.findOne(filtro).lean();
  }

  async update(query, newData) {
    try {
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

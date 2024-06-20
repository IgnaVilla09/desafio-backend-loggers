import mongoose from "mongoose";

export const usuariosModelo = mongoose.model(
  "usuarios",
  new mongoose.Schema(
    {
      nombre: String,
      apellido: String,
      email: { type: String, required: true, unique: true },
      password: String ,
      age: { type: Number, min: 18 },
      cartId: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
      role: { type: String, default: "usuario" },
    },
    {
      timestamps: true,
      strict: false,
    }
  )
);

import mongoose from "mongoose";

const cartColl = "carts";

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        price: {
          type: Number,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    subtotal: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const modeloCarrito = mongoose.model(cartColl, cartSchema);

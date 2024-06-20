import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const productsColl = "products";
const productsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true, min: 0 },
    thumbnail: String,
    owner: { type: String, default: "admin", required: true  },
    code: { type: Number, required: true },
    stock: { type: Number, required: true, min: 1 },
    status: Boolean,
    category: String,
  },
  { timestamps: true }
);

productsSchema.plugin(paginate);

export const modeloProductos = mongoose.model(productsColl, productsSchema);

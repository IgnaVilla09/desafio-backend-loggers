import mongoose from "mongoose";

const fakeProductsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true, min: 0 },
    thumbnail: String,
    code: { type: Number, required: true },
    stock: { type: Number, required: true, min: 1 },
    status: Boolean,
    category: String,
  },
  { timestamps: true, collection: "productsFake" }
);

const FakeProduct = mongoose.model("FakeProduct", fakeProductsSchema);

export default FakeProduct;

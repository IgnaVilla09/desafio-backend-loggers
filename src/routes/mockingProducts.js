import { fakerES_MX as faker } from "@faker-js/faker";
import { Router } from "express";
import FakeProduct from "../dao/models/products.fake.modelo.js";

const router = Router();

// ENDPOINT FAKE PRODUCTOS
router.get("/", async (req, res) => {
  try {
    const fakeProducts = [];

    for (let i = 0; i < 100; i++) {
      const fakeProduct = {
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        thumbnail: faker.image.url(),
        code: faker.string.numeric({ length: 12 }),
        stock: faker.string.numeric({ length: 3, min: 1 }),
        status: faker.datatype.boolean(),
        category: faker.commerce.department(),
      };

      fakeProducts.push(fakeProduct);
    }

    await FakeProduct.insertMany(fakeProducts);

    res.status(201).json({ fakeProducts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al generar productos con faker" });
  }
});

export { router };

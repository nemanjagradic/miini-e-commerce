const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Product = require("../models/productModel");

dotenv.config({ path: "./config.env" });

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, "utf-8")
);

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {}).then(() => {});

const importData = async () => {
  try {
    await Product.create(products);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}

const fs = require("fs");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

dotenv.config({ path: "./config.env" });

const rawProducts = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, "utf-8")
);

const DEFAULT_CATEGORIES = [
  { name: "Chairs", slug: "chairs", sortOrder: 1, image: "images/hero-chairs.png" },
  { name: "Tables", slug: "tables", sortOrder: 2, image: "images/hero-tables.jpg" },
  { name: "Lamps", slug: "lamps", sortOrder: 3, image: "images/hero-lamps.jpg" },
  { name: "Clocks", slug: "clocks", sortOrder: 4, image: null },
  { name: "Other", slug: "other", sortOrder: 5, image: null },
];

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB, {}).then(() => {});

const ensureCategories = async () => {
  for (const cat of DEFAULT_CATEGORIES) {
    await Category.findOneAndUpdate({ slug: cat.slug }, cat, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });
  }
  const categories = await Category.find();
  return Object.fromEntries(categories.map((c) => [c.slug, c._id]));
};

const toProductDocs = (bySlug) =>
  rawProducts.map((p) => ({
    ...p,
    category: bySlug[p.category],
    imgs: (p.imgs || []).map((url, index) => ({
      url,
      sortOrder: index,
      isPrimary: index === 0,
    })),
  }));

const importData = async () => {
  try {
    const bySlug = await ensureCategories();
    const products = toProductDocs(bySlug);
    await Product.create(products);
    console.log("Imported products + categories.");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Product.deleteMany();
    await Category.deleteMany();
    console.log("Deleted products + categories.");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
} else {
  console.log("Use --import or --delete");
  process.exit(1);
}

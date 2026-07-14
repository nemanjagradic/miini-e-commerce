const path = require("path");
const fs = require("fs");

const userUploadDir =
  process.env.USER_UPLOAD_DIR ||
  path.join(__dirname, "../public/images/users");

const productUploadDir =
  process.env.PRODUCT_UPLOAD_DIR ||
  path.join(__dirname, "../public/images/products");

const categoryUploadDir =
  process.env.CATEGORY_UPLOAD_DIR ||
  path.join(__dirname, "../public/images/categories");

fs.mkdirSync(userUploadDir, { recursive: true });
fs.mkdirSync(productUploadDir, { recursive: true });
fs.mkdirSync(categoryUploadDir, { recursive: true });

module.exports = { userUploadDir, productUploadDir, categoryUploadDir };

const path = require("path");
const fs = require("fs");

const userUploadDir =
  process.env.USER_UPLOAD_DIR ||
  path.join(__dirname, "../public/images/users");

fs.mkdirSync(userUploadDir, { recursive: true });

module.exports = { userUploadDir };

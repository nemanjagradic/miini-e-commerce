const path = require("path");
const fs = require("fs");

// Railway: mount a volume to /data/user-uploads and set USER_UPLOAD_DIR=/data/user-uploads
const userUploadDir =
  process.env.USER_UPLOAD_DIR ||
  path.join(__dirname, "../public/images/users");

fs.mkdirSync(userUploadDir, { recursive: true });

module.exports = { userUploadDir };

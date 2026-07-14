const express = require("express");
const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
const categoryController = require("../controllers/categoryController");
const authController = require("../controllers/authController");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { categoryUploadDir } = require("../utils/uploadPaths");

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) cb(null, true);
    else cb(new AppError("Only images are allowed", 400), false);
  },
});

const resizeCategoryImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  const filename = `category-${Date.now()}.jpeg`;
  const filePath = path.join(categoryUploadDir, filename);
  await sharp(req.file.buffer)
    .resize(1200, 800, { fit: "cover" })
    .toFormat("jpeg")
    .jpeg({ quality: 85 })
    .toFile(filePath);
  req.file.filename = filename;
  next();
});

router.get("/", categoryController.getAllCategories);
router.get("/:slugOrId", categoryController.getCategory);

router.use(authController.protect, authController.restrictTo("admin"));

router.post("/", categoryController.createCategory);
router.patch(
  "/:id",
  upload.single("imageFile"),
  resizeCategoryImage,
  categoryController.updateCategory
);
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;

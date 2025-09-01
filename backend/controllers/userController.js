const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

exports.getMe = catchAsync(async (req, res, next) => {
  if (!req.user) {
    return next(new AppError("You are not logged in", 401));
  }

  res.status(200).json({
    status: "success",
    data: req.user,
  });
});

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Only images are allowed", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadImage = upload.single("photo");

exports.resizeUserImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .toFile(`public/images/users/${req.file.filename}`);

  next();
});

const filterObj = (obj, ...alowwedFields) => {
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    if (alowwedFields.includes(el)) newObject[el] = obj[el];
  });

  return newObject;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  try {
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError("This route is not for updating password.", 400)
      );
    }
    const filteredObj = filterObj(req.body, "name", "email");
    if (req.file) filteredObj.photo = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredObj, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: { user: updatedUser },
    });
  } catch (err) {
    return next(new AppError(err.message || "Failed to update user", 400));
  }
});

exports.toggleFavorite = catchAsync(async (req, res, next) => {
  const { productId } = req.body;
  const user = await User.findById(req.user.id);

  if (user.favorites.includes(productId)) {
    user.favorites = user.favorites.filter((id) => id.toString() !== productId);
  } else {
    user.favorites.push(productId);
  }

  await user.save({ validateBeforeSave: false });
  const updatedUser = await User.findById(req.user.id).populate("favorites");

  res.status(200).json({
    status: "success",
    data: updatedUser.favorites,
  });
});

exports.getFavorites = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate("favorites");

  if (!user) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "success",
    results: user.favorites.length,
    data: user.favorites,
  });
});

exports.clearGuestFavorites = catchAsync(async (req, res, next) => {
  if (req.user.email !== "guest@example.com") {
    return res.status(200).json({ status: "success" });
  }

  const user = await User.findById(req.user.id);
  user.favorites = [];
  await user.save({ validateBeforeSave: false });

  res.status(200).json({ status: "success", data: [] });
});

const path = require("path");
const fs = require("fs/promises");
const catchAsync = require("../utils/catchAsync");
const multer = require("multer");
const sharp = require("sharp");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const logAdminAction = require("../utils/logAdminAction");
const { userUploadDir } = require("../utils/uploadPaths");
const { validateShippingAddress } = require("../utils/shippingAddress");

const OBJECT_ID_RE = /^[0-9a-fA-F]{24}$/;

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
  const filePath = path.join(userUploadDir, req.file.filename);

  const user = await User.findById(req.user.id);
  if (user?.photo?.startsWith("user-")) {
    await fs.unlink(path.join(userUploadDir, user.photo)).catch(() => {});
  }

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .toFile(filePath);

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
    const filteredObj = filterObj(req.body, "name", "email", "shippingAddress");
    if (req.file) filteredObj.photo = req.file.filename;

    if (filteredObj.shippingAddress !== undefined) {
      let raw = filteredObj.shippingAddress;
      if (typeof raw === "string") {
        try {
          raw = JSON.parse(raw);
        } catch {
          return next(new AppError("Invalid shipping address payload.", 400));
        }
      }
      try {
        filteredObj.shippingAddress = validateShippingAddress(raw);
      } catch (err) {
        return next(new AppError(err.message, err.statusCode || 400));
      }
    }

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

exports.adminListUsers = catchAsync(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 20));
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.q?.trim()) {
    const q = req.query.q.trim();
    filter.$or = [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { role: { $regex: q, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("+active name email role photo tokenVersion")
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  res.status(200).json({
    status: "success",
    results: users.length,
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
    data: users.map((u) => ({
      ...u,
      active: u.active !== false,
    })),
  });
});

exports.adminSetUserActive = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  if (!OBJECT_ID_RE.test(id)) {
    return next(new AppError("That user could not be found.", 400));
  }

  if (String(req.user.id) === String(id)) {
    return next(new AppError("You cannot deactivate your own account.", 400));
  }

  const { active } = req.body;
  if (typeof active !== "boolean") {
    return next(
      new AppError("Choose whether to activate or deactivate the user.", 400)
    );
  }

  const user = await User.findById(id).select("+active");
  if (!user) {
    return next(new AppError("That user could not be found.", 404));
  }

  const wasActive = user.active !== false;
  if (wasActive === active) {
    return res.status(200).json({
      status: "success",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: wasActive,
      },
    });
  }

  user.active = active;
  if (!active) {
    user.tokenVersion = (user.tokenVersion ?? 0) + 1;
  }
  await user.save({ validateBeforeSave: false });

  await logAdminAction(req, {
    action: active ? "user.activate" : "user.deactivate",
    resourceType: "User",
    resourceId: user._id,
    meta: { email: user.email, active },
  });

  res.status(200).json({
    status: "success",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active !== false,
    },
  });
});

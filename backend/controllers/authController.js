const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Email = require("../utils/email");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { promisify } = require("util");
const crypto = require("crypto");

const signToken = (id, tokenVersion = 0) => {
  return jwt.sign({ id, tokenVersion }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const getCookieOptions = (req) => ({
  expires: new Date(
    Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
  ),
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  httpOnly: true,
  secure: req.secure || req.headers["x-forwarded-proto"] === "https",
});

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id, user.tokenVersion ?? 0);

  res.cookie("jwt", token, getCookieOptions(req));

  user.password = undefined;

  res.status(statusCode).json({ status: "success", token, data: user });
};

exports.signup = catchAsync(async (req, res) => {
  const { name, email, password, passwordConfirm } = req.body;

  const url = `${process.env.FRONTEND_URL}/profile`;

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
  });

  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, req, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("You must provide email and password.", 400));

  const user = await User.findOne({ email }).select("+password +active");

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Incorrect email or password.", 401));

  if (user.active === false)
    return next(new AppError("This account has been deactivated.", 401));

  createSendToken(user, 200, req, res);
});

exports.logout = catchAsync(async (req, res) => {
  res.cookie("jwt", "", {
    ...getCookieOptions(req),
    expires: new Date(Date.now() + 10 * 1000),
  });
  res.status(200).json({ status: "success" });
});

exports.protect = catchAsync(async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) token = req.cookies.jwt;

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id).select("+active");
    if (!currentUser) {
      return next(
        new AppError(
          "A user belonging to this token does no longer exist.",
          401
        )
      );
    }

    if (currentUser.active === false) {
      return next(
        new AppError("This account has been deactivated.", 401)
      );
    }

    const tokenVersion = decoded.tokenVersion ?? 0;
    if (tokenVersion !== (currentUser.tokenVersion ?? 0)) {
      return next(
        new AppError("Session is no longer valid. Please log in again.", 401)
      );
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError(
          "A password was changed after token was issued. Please log in again.",
          401
        )
      );
    }

    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action.", 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    return next(new AppError("There is no user beloning to this email.", 404));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    await new Email(user, resetURL).sendPasswordReset();

    res
      .status(200)
      .json({ status: "success", message: "Token sent to email." });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending an email. Please try later!",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("Token is invalid or expired.", 400));

  user.password = req.body.newPassword;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = null;
  user.passwordResetTokenExpires = null;
  await user.save();

  createSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, passwordConfirm } = req.body;

  if (!currentPassword)
    return next(new AppError("Please provide your current password.", 400));
  if (!newPassword)
    return next(new AppError("Please provide a new password.", 400));
  if (!passwordConfirm)
    return next(new AppError("Please confirm your new password.", 400));
  if (newPassword !== passwordConfirm)
    return next(
      new AppError("New password and confirmation do not match.", 400)
    );

  const user = await User.findById(req.user.id).select("+password");
  if (!(await user.correctPassword(currentPassword, user.password))) {
    return next(new AppError("Your current password is incorrect.", 400));
  }

  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  createSendToken(user, 200, req, res);
});

const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = async (user, statusCode, req, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  };

  res.cookie("jwt", cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({ status: "success", token, data: user });
};

exports.signup = async (req, res) => {
  const { name, email, password, passwordConfirm, photo, role } = req.body;

  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    photo,
    role,
  });

  createSendToken(newUser, 201, req, res);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new Error("You must provide email and password.");

  const user = await User.findOne(email).select("+password");

  if (!user || !(await user.correctPassword(password, user.password)))
    throw new Error("Incorrect email or password.");

  createSendToken(user, 200, req, res);
};

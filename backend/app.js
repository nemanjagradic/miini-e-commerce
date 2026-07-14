const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const cartRouter = require("./routes/cartRoutes");
const orderRouter = require("./routes/orderRoutes");
const settingsRouter = require("./routes/settingsRoutes");
const auditRouter = require("./routes/auditRoutes");
const globalErrorHandler = require("./controllers/errorController");
const orderController = require("./controllers/orderController");
const AppError = require("./utils/appError");
const {
  userUploadDir,
  productUploadDir,
  categoryUploadDir,
} = require("./utils/uploadPaths");

const app = express();
app.set("trust proxy", 1);

app.use(
  cors({
    origin: ["http://localhost:3000", "https://miini-e-commerce.vercel.app"],
    credentials: true,
  }),
);

app.use(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  orderController.webhookHandler,
);

app.use("/images/users", express.static(userUploadDir));
app.use("/images/products", express.static(productUploadDir));
app.use("/images/categories", express.static(categoryUploadDir));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use(helmet());

app.use(mongoSanitize());
app.use(xss());
app.use(compression());

const limiter = rateLimit({
  max: 300,
  windowMs: 60 * 60 * 1000,
  handler: (req, res) => {
    res.status(429).json({
      status: "fail",
      message: "You made too many requests. Please try again in an hour!",
    });
  },
  trustProxy: 1,
});

app.use("/api", limiter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/settings", settingsRouter);
app.use("/api/audit", auditRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

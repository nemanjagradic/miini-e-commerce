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
const cartRouter = require("./routes/cartRoutes");
const orderRouter = require("./routes/orderRoutes");
const globalErrorHandler = require("./controllers/errorController");
const orderController = require("./controllers/orderController");
const AppError = require("./utils/appError");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "https://miini-e-commerce.onrender.com"],
    credentials: true,
  })
);

app.use(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  orderController.webhookHandler
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json({ limit: "10kb" }));
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
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

module.exports = app;

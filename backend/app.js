const express = require("express");
const cors = require("cors");
const path = require("path");
const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);

app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Route ${req.originalUrl} is not found on this server.`,
  });
});

module.exports = app;

const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });

const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {})
  .then(() => {
    console.log("Successfully connected to database!");
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });

const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

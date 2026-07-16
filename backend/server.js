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

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const shutdown = (signal) => {
  console.log(`${signal} received, shutting down gracefully…`);
  server.close(async () => {
    try {
      await mongoose.connection.close();
      console.log("HTTP server and database closed.");
      process.exit(0);
    } catch (err) {
      console.error("Error during shutdown:", err);
      process.exit(1);
    }
  });

  // Force exit if connections hang
  setTimeout(() => {
    console.error("Forced shutdown after timeout.");
    process.exit(1);
  }, 10000).unref();
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

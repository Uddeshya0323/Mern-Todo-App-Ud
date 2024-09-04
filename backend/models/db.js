const mongoose = require("mongoose");

const DB_URL = process.env.DB_URL;

if (!DB_URL) {
  console.error("DB_URL is not defined in the environment variables");
  process.exit(1); // Exit if DB_URL is not set
}

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("MongoDB is connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

module.exports = mongoose; // Optionally export mongoose if needed

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const runMigration = require("./migrations/runMigration");

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.once("open", async () => {
  console.log("MongoDB connected");
  await runMigration(); // automatic migration
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Mount routes with /api prefix
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/questions", require("./routes/questionRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

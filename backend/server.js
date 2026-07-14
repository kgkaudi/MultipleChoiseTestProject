require("dotenv").config();
const mongoose = require("mongoose");
const runMigration = require("./migrations/runMigration");
const app = require("./app");

mongoose.connect(process.env.MONGO_URI);

mongoose.connection.once("open", async () => {
  console.log("MongoDB connected");
  await runMigration();
});

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

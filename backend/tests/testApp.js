const express = require("express");
const db = require("./setup");

// Import real routes
const authRoutes = require("../routes/authRoutes");
const questionRoutes = require("../routes/questionRoutes");
const userRoutes = require("../routes/userRoutes");

const app = express();

// Use JSON middleware
app.use(express.json());

// Connect to in-memory DB before running tests
beforeAll(async () => {
  await db.connect();
});

// Close DB after tests
afterAll(async () => {
  await db.close();
});

// Mount real routes
app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/users", userRoutes);

module.exports = app;

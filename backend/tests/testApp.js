const db = require("./setup");
const app = require("../app");

beforeAll(async () => {
  await db.connect();
});

afterAll(async () => {
  await db.close();
});

module.exports = app;
const db = require("./setup");
const request = require("supertest");
let app;
let token;
let userId;

beforeAll(async () => {
  await db.connect();
  app = require("../../app");

  await request(app)
    .post("/api/auth/register")
    .send({
      username: "Tester",
      email: "tester@test.com",
      password: "123456"
    });

  const login = await request(app)
    .post("/api/auth/login")
    .send({
      email: "tester@test.com",
      password: "123456"
    });

  token = login.body.token;
  userId = login.body.user._id;
});

afterAll(async () => {
  await db.close();
});

describe("USER API", () => {

  it("should register", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "Another",
        email: "another@test.com",
        password: "123456"
      });

    expect(res.status).toBe(200);
  });

  it("should login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "tester@test.com",
        password: "123456"
      });

    expect(res.status).toBe(200);
  });

  it("should get user", async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it("should reject unauthorized access", async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`);

    expect(res.status).toBe(401);
  });

  it("should return 404 for unknown user", async () => {
    const unknownId = "507f1f77bcf86cd799439011";
    const res = await request(app)
      .get(`/api/users/${unknownId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("should reject invalid ObjectId", async () => {
    const res = await request(app)
      .get(`/api/users/123`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

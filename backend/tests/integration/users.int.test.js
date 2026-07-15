const db = require("./setup");
const request = require("supertest");
let app;
let token;
let userId;

beforeAll(async () => {
  await db.connect();
  app = require("../../app");

  // Register base user
  await request(app)
    .post("/api/auth/register")
    .send({
      username: "Tester",
      email: "tester@test.com",
      password: "123456"
    });

  // Login (FIXED: identifier instead of email)
  const login = await request(app)
    .post("/api/auth/login")
    .send({
      identifier: "tester@test.com",
      password: "123456"
    });

  token = login.body.token;
  userId = login.body.user._id;
});

afterAll(async () => {
  await db.close();
});

describe("USER API", () => {

  /* ===========================
     REGISTER
  ============================ */

  it("should register", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "AnotherUser",
        email: "another@test.com",
        password: "123456"
      });

    expect(res.status).toBe(200);
  });

  it("should fail on duplicate email", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "DupUser",
        email: "tester@test.com",
        password: "abcdef"
      });

    expect(res.status).toBe(400);
  });

  it("should fail on invalid email format", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "BadEmail",
        email: "not-an-email",
        password: "123456"
      });

    expect(res.status).toBe(400);
  });

  it("should fail on missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({});

    expect(res.status).toBe(400);
  });

  /* ===========================
     LOGIN
  ============================ */

  it("should login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        identifier: "tester@test.com",
        password: "123456"
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should login with username", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "UserLogin",
        email: "userlogin@test.com",
        password: "123456"
      });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        identifier: "UserLogin",
        password: "123456"
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should fail with wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        identifier: "tester@test.com",
        password: "wrongpass"
      });

    expect(res.status).toBe(400);
  });

  it("should fail if user does not exist", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        identifier: "doesnotexist@test.com",
        password: "123456"
      });

    expect(res.status).toBe(400);
  });

  it("should fail on missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({});

    expect(res.status).toBe(400);
  });

  /* ===========================
     GET USER BY ID
  ============================ */

  it("should get user", async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(userId);
  });

  it("should reject unauthorized access", async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`);

    expect(res.status).toBe(401);
  });

  it("should reject invalid token", async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set("Authorization", "Bearer invalidtoken123");

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
      .get(`/api/users/invalid-id`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  /* ===========================
     GET PROFILE (/me)
  ============================ */

  it("should return profile", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userId);
  });

  it("should fail without token", async () => {
    const res = await request(app)
      .get("/api/users/me");

    expect(res.status).toBe(401);
  });

  it("should fail with invalid token", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", "Bearer invalidtoken123");

    expect(res.status).toBe(401);
  });
});

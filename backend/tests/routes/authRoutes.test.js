const request = require("supertest");
const app = require("../testApp");

describe("AUTH ROUTES", () => {

  /* ===========================
     REGISTER
  ============================ */

  it("POST /api/auth/register should register", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "RouteTester",
        email: "route@test.com",
        password: "123456"
      });

    expect(res.status).toBe(200);
  });

  it("POST /api/auth/register should fail on missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({});

    expect(res.status).toBe(400);
  });

  it("POST /api/auth/register should fail on invalid email format", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "BadEmailUser",
        email: "not-an-email",
        password: "123456"
      });

    expect(res.status).toBe(400);
  });

  it("POST /api/auth/register should fail if email already exists", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "DuplicateUser",
        email: "duplicate@test.com",
        password: "123456"
      });

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "DuplicateUser2",
        email: "duplicate@test.com",
        password: "abcdef"
      });

    expect(res.status).toBe(400);
  });

  /* ===========================
     LOGIN
  ============================ */

  it("POST /api/auth/login should login with email", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "LoginTester",
        email: "login@test.com",
        password: "123456"
      });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        identifier: "login@test.com",
        password: "123456"
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("POST /api/auth/login should login with username", async () => {
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

  it("POST /api/auth/login should fail with wrong password", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "WrongPassUser",
        email: "wrongpass@test.com",
        password: "correctpass"
      });

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        identifier: "wrongpass@test.com",
        password: "incorrectpass"
      });

    expect(res.status).toBe(400);
  });

  it("POST /api/auth/login should fail if user does not exist", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        identifier: "doesnotexist@test.com",
        password: "123456"
      });

    expect(res.status).toBe(400);
  });

  it("POST /api/auth/login should fail on missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({});

    expect(res.status).toBe(400);
  });

  it("POST /api/auth/login should fail on invalid email format (identifier looks like email)", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        identifier: "not-an-email",
        password: "123456"
      });

    // invalid email format only applies when identifier *looks* like email
    expect(res.status).toBe(400);
  });
});

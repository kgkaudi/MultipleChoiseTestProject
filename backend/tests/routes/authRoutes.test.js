const request = require("supertest");
const app = require("../testApp");

describe("AUTH ROUTES", () => {

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

  it("POST /api/auth/login should login", async () => {
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
        email: "login@test.com",
        password: "123456"
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
});

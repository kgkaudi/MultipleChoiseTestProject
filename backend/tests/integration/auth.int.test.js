const db = require("./setup");
const request = require("supertest");
let app;

beforeAll(async () => {
  await db.connect();
  app = require("../../app");
});

afterAll(async () => {
  await db.close();
});

describe("AUTH API", () => {
  let token;

  /* ===========================
     REGISTER
  ============================ */
  it("should register a user successfully", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "Tester",
        email: "tester@test.com",
        password: "123456"
      });

    expect(res.status).toBe(200);
    expect(res.body.user.username).toBe("Tester");
  });

  it("should fail if email already exists", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "AnotherUser",
        email: "tester@test.com",
        password: "123456"
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Email already exists");
  });

  it("should fail if username already exists", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "Tester",
        email: "new@test.com",
        password: "123456"
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Username already exists");
  });

  it("should fail for missing fields", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing fields");
  });

  it("should fail for invalid email format", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        username: "BadEmailUser",
        email: "not-an-email",
        password: "123456"
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid email format");
  });

  /* ===========================
     LOGIN (email OR username)
  ============================ */
  it("should login successfully with email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        identifier: "tester@test.com",
        password: "123456"
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  it("should login successfully with username", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        identifier: "Tester",
        password: "123456"
      });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it("should fail for wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        identifier: "Tester",
        password: "wrongpass"
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid credentials");
  });

  it("should fail for missing identifier", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        password: "123456"
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing fields");
  });

  it("should fail for missing password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({
        identifier: "Tester"
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing fields");
  });

  it("should fail for empty body", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({});

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Missing fields");
  });
});

/* ===========================
   QUESTION API (unchanged)
=========================== */
describe("QUESTION API", () => {
  let token;
  let questionId;

  beforeAll(async () => {
    const login = await request(app)
      .post("/api/auth/login")
      .send({
        identifier: "tester@test.com",
        password: "123456"
      });

    token = login.body.token;
  });

  it("should create a question", async () => {
    const res = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        question: "What is 2+2?",
        answers: ["1", "2", "3", "4"],
        correctIndex: 3,
        category: "math"
      });

    expect(res.status).toBe(201);
    questionId = res.body._id;
  });

  it("should get all questions", async () => {
    const res = await request(app)
      .get("/api/questions")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should get question by ID", async () => {
    const res = await request(app)
      .get(`/api/questions/${questionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it("should return 404 for unknown question", async () => {
    const unknownId = "507f1f77bcf86cd799439011";
    const res = await request(app)
      .get(`/api/questions/${unknownId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("should update a question", async () => {
    const res = await request(app)
      .put(`/api/questions/${questionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        question: "Updated?",
        answers: ["Yes", "No"],
        correctIndex: 0,
        category: "general"
      });

    expect(res.status).toBe(200);
  });

  it("should delete a question", async () => {
    const res = await request(app)
      .delete(`/api/questions/${questionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it("should return 404 when deleting unknown question", async () => {
    const unknownId = "507f1f77bcf86cd799439011";
    const res = await request(app)
      .delete(`/api/questions/${unknownId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

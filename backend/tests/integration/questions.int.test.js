const db = require("./setup");
const request = require("supertest");
let app;
let token;

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
});

afterAll(async () => {
  await db.close();
});

describe("QUESTION API", () => {
  let questionId;

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

  it("should reject missing fields", async () => {
    const res = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
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

  it("should reject invalid ObjectId", async () => {
    const res = await request(app)
      .get(`/api/questions/123`)
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

  it("should return 404 when updating unknown question", async () => {
    const unknownId = "507f1f77bcf86cd799439011";
    const res = await request(app)
      .put(`/api/questions/${unknownId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        question: "Updated?",
        answers: ["Yes", "No"],
        correctIndex: 0,
        category: "general"
      });

    expect(res.status).toBe(404);
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

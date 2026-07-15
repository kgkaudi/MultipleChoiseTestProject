const request = require("supertest");
const app = require("../testApp");
const mongoose = require("mongoose");

describe("QUESTION ROUTES", () => {
  let token;
  let questionId;

  beforeAll(async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "QTester",
        email: "q@test.com",
        password: "123456"
      });

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        identifier: "q@test.com",
        password: "123456"
      });

    token = login.body.token;
  });

  /* ===========================
     CREATE
  ============================ */

  it("POST /api/questions should create", async () => {
    const res = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        question: "Route Q?",
        answers: ["A", "B"],
        correctIndex: 1,
        category: "general"
      });

    expect(res.status).toBe(201);
    questionId = res.body._id;
  });

  it("POST /api/questions should fail on missing fields", async () => {
    const res = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it("POST /api/questions should fail on invalid correctIndex", async () => {
    const res = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        question: "Bad index?",
        answers: ["A", "B"],
        correctIndex: 5,
        category: "general"
      });

    expect(res.status).toBe(400);
  });

  it("POST /api/questions should fail without token", async () => {
    const res = await request(app)
      .post("/api/questions")
      .send({
        question: "Unauthorized?",
        answers: ["A", "B"],
        correctIndex: 0,
        category: "general"
      });

    expect(res.status).toBe(401);
  });

  /* ===========================
     GET LIST
  ============================ */

  it("GET /api/questions should return list", async () => {
    const res = await request(app)
      .get("/api/questions")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/questions should fail without token", async () => {
    const res = await request(app).get("/api/questions");
    expect(res.status).toBe(401);
  });

  /* ===========================
     GET BY ID
  ============================ */

  it("GET /api/questions/:id should return question", async () => {
    const res = await request(app)
      .get(`/api/questions/${questionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(questionId);
  });

  it("GET /api/questions/:id should fail on invalid ObjectId", async () => {
    const res = await request(app)
      .get("/api/questions/invalid-id")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it("GET /api/questions/:id should return 404 for unknown question", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/questions/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  /* ===========================
     UPDATE
  ============================ */

  it("PUT /api/questions/:id should update question", async () => {
    const res = await request(app)
      .put(`/api/questions/${questionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        question: "Updated Q?",
        answers: ["X", "Y"],
        correctIndex: 0,
        category: "updated"
      });

    expect(res.status).toBe(200);
    expect(res.body.question).toBe("Updated Q?");
  });

  it("PUT /api/questions/:id should return 404 for unknown question", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .put(`/api/questions/${fakeId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        question: "Doesn't exist",
        answers: ["A", "B"],
        correctIndex: 0,
        category: "none"
      });

    expect(res.status).toBe(404);
  });

  /* ===========================
     DELETE
  ============================ */

  it("DELETE /api/questions/:id should delete question", async () => {
    const res = await request(app)
      .delete(`/api/questions/${questionId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it("DELETE /api/questions/:id should return 404 for unknown question", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .delete(`/api/questions/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});

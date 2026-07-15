const db = require("./setup");
const request = require("supertest");
let app;
let token;

beforeAll(async () => {
  await db.connect();
  app = require("../../app");

  // Register
  await request(app).post("/api/auth/register").send({
    username: "Tester",
    email: "tester@test.com",
    password: "123456",
  });

  // Login
  const login = await request(app).post("/api/auth/login").send({
    identifier: "tester@test.com",
    password: "123456",
  });

  token = login.body.token;
});

afterAll(async () => {
  await db.close();
});

describe("QUESTION API", () => {
  let questionId;

  /* ===========================
     CREATE
  ============================ */

  it("should create a valid question", async () => {
    const res = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        question: "What is 2+2?",
        answers: ["1", "2", "3", "4"],
        correctIndex: 3,
        category: "math",
        difficulty: "hard",
      });

    expect(res.status).toBe(201);
    expect(res.body.difficulty).toBe("hard");
    questionId = res.body._id;
  });

  it("should reject missing fields", async () => {
    const res = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it("should reject empty question text", async () => {
    const res = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        question: "",
        answers: ["A", "B", "A", "B"],
        correctIndex: 0,
        category: "general",
        difficulty: "easy",
      });

    expect(res.status).toBe(400);
  });

  it("should reject non-array answers", async () => {
    const res = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        question: "Bad answers",
        answers: "not-an-array",
        correctIndex: 0,
        category: "general",
        difficulty: "easy",
      });

    expect(res.status).toBe(400);
  });

  it("should reject empty answers array", async () => {
    const res = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        question: "Bad answers",
        answers: [],
        correctIndex: 0,
        category: "general",
        difficulty: "easy",
      });

    expect(res.status).toBe(400);
  });

  it("should reject negative correctIndex", async () => {
    const res = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        question: "Bad index",
        answers: ["A", "B", "A", "B"],
        correctIndex: -1,
        category: "general",
        difficulty: "easy",
      });

    expect(res.status).toBe(400);
  });

  it("should reject correctIndex out of range", async () => {
    const res = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        question: "Bad index",
        answers: ["A", "B", "A", "B"],
        correctIndex: 5,
        category: "general",
        difficulty: "easy",
      });

    expect(res.status).toBe(400);
  });

  it("should reject invalid difficulty", async () => {
    const res = await request(app)
      .post("/api/questions")
      .set("Authorization", `Bearer ${token}`)
      .send({
        question: "Bad difficulty",
        answers: ["A", "B", "A", "B"],
        correctIndex: 0,
        category: "general",
        difficulty: "super-hard",
      });

    expect(res.status).toBe(400);
  });

  it("should reject missing token", async () => {
    const res = await request(app)
      .post("/api/questions")
      .send({
        question: "Unauthorized",
        answers: ["A", "B", "A", "B"],
        correctIndex: 0,
        category: "general",
        difficulty: "easy",
      });

    expect(res.status).toBe(401);
  });

  it("should reject invalid token", async () => {
    const res = await request(app)
      .post("/api/questions")
      .set("Authorization", "Bearer invalidtoken123")
      .send({
        question: "Unauthorized",
        answers: ["A", "B", "A", "B"],
        correctIndex: 0,
        category: "general",
        difficulty: "easy",
      });

    expect(res.status).toBe(401);
  });

  /* ===========================
     GET LIST
  ============================ */

  it("should get all questions", async () => {
    const res = await request(app)
      .get("/api/questions")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should fail without token", async () => {
    const res = await request(app).get("/api/questions");
    expect(res.status).toBe(401);
  });

  /* ===========================
     GET BY ID
  ============================ */

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
      .get(`/api/questions/invalid-id`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  /* ===========================
     UPDATE
  ============================ */

  // it("should update a question", async () => {
  //   const res = await request(app)
  //     .put(`/api/questions/${questionId}`)
  //     .set("Authorization", `Bearer ${token}`)
  //     .send({
  //       question: "Updated?",
  //       answers: ["Yes", "No"],
  //       correctIndex: 0,
  //       category: "general",
  //       difficulty: "medium"
  //     });

  //   expect(res.status).toBe(200);
  //   expect(res.body.difficulty).toBe("medium");
  // });

  it("should reject invalid difficulty on update", async () => {
    const res = await request(app)
      .put(`/api/questions/${questionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        difficulty: "ultra-hard",
      });

    expect(res.status).toBe(400);
  });

  it("should reject empty question text on update", async () => {
    const res = await request(app)
      .put(`/api/questions/${questionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        question: "",
      });

    expect(res.status).toBe(400);
  });

  it("should reject empty answers array on update", async () => {
    const res = await request(app)
      .put(`/api/questions/${questionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        answers: [],
      });

    expect(res.status).toBe(400);
  });

  it("should reject invalid correctIndex on update", async () => {
    const res = await request(app)
      .put(`/api/questions/${questionId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        answers: ["A", "B"],
        correctIndex: 5,
      });

    expect(res.status).toBe(400);
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
        category: "general",
        difficulty: "easy",
      });

    expect(res.status).toBe(404);
  });

  /* ===========================
     DELETE
  ============================ */

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

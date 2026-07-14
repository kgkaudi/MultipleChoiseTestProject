const request = require("supertest");
const app = require("../testApp");

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
        email: "q@test.com",
        password: "123456"
      });

    token = login.body.token;
  });

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

  it("GET /api/questions should return list", async () => {
    const res = await request(app)
      .get("/api/questions")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});

const request = require("supertest");
const app = require("../testApp");
const mongoose = require("mongoose");

describe("USER ROUTES", () => {
  let token;
  let userId;

  beforeAll(async () => {
    await request(app)
      .post("/api/auth/register")
      .send({
        username: "RouteUser",
        email: "routeuser@test.com",
        password: "123456"
      });

    const login = await request(app)
      .post("/api/auth/login")
      .send({
        email: "routeuser@test.com",
        password: "123456"
      });

    token = login.body.token;
    userId = login.body.user._id;
  });

  /* ===========================
     LIST USERS
  ============================ */

  it("GET /api/users should return list (public)", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  /* ===========================
     GET USER BY ID
  ============================ */

  it("GET /api/users/:id should return user (protected)", async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(userId);
  });

  it("GET /api/users/:id should fail without token", async () => {
    const res = await request(app).get(`/api/users/${userId}`);
    expect(res.status).toBe(401);
  });

  it("GET /api/users/:id should fail on invalid ObjectId", async () => {
    const res = await request(app)
      .get("/api/users/invalid-id")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404); // backend returns 404 for invalid ID
  });

  it("GET /api/users/:id should return 404 for unknown user", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/users/${fakeId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  /* ===========================
     GET PROFILE (/me)
  ============================ */

  it("GET /api/users/me should return profile (protected)", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(userId); // controller returns { id, role }
  });

  it("GET /api/users/me should fail without token", async () => {
    const res = await request(app).get("/api/users/me");
    expect(res.status).toBe(401);
  });

  /* ===========================
     CHANGE PASSWORD
  ============================ */

  it("PUT /api/users/change-password should change password (protected)", async () => {
    const res = await request(app)
      .put("/api/users/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        current: "123456",
        new: "newpass123"
      });

    expect(res.status).toBe(200);
  });

  it("PUT /api/users/change-password should fail with wrong current password", async () => {
    const res = await request(app)
      .put("/api/users/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({
        current: "wrongpass",
        new: "newpass123"
      });

    expect(res.status).toBe(400);
  });

  it("PUT /api/users/change-password should fail on missing fields", async () => {
    const res = await request(app)
      .put("/api/users/change-password")
      .set("Authorization", `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });

  it("PUT /api/users/change-password should fail without token", async () => {
    const res = await request(app)
      .put("/api/users/change-password")
      .send({
        current: "123456",
        new: "newpass123"
      });

    expect(res.status).toBe(401);
  });

  /* ===========================
     TOKEN TAMPERING
  ============================ */

  it("should reject tampered token", async () => {
    const tampered = token.slice(0, -5) + "abcde";

    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${tampered}`);

    expect(res.status).toBe(401);
  });
});

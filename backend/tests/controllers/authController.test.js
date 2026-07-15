const authController = require("../../controllers/authController");
const authService = require("../../services/authService");

jest.mock("../../services/authService");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Auth Controller", () => {
  /* ===========================
     REGISTER
  ============================ */
  describe("register()", () => {
    it("should register a user successfully", async () => {
      const req = { body: { username: "Test", email: "test@test.com", password: "123456" } };
      const res = mockRes();

      authService.register.mockResolvedValue({ user: { id: 1, username: "Test" } });

      await authController.register(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "User registered",
        user: { id: 1, username: "Test" }
      });
    });

    it("should return error if email already exists", async () => {
      const req = { body: { username: "Test", email: "test@test.com", password: "123456" } };
      const res = mockRes();

      authService.register.mockResolvedValue({ error: "Email already exists" });

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Email already exists" });
    });

    it("should return error if username already exists", async () => {
      const req = { body: { username: "Test", email: "test@test.com", password: "123456" } };
      const res = mockRes();

      authService.register.mockResolvedValue({ error: "Username already exists" });

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Username already exists" });
    });

    it("should return error for missing fields", async () => {
      const req = { body: {} };
      const res = mockRes();

      authService.register.mockResolvedValue({ error: "Missing fields" });

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Missing fields" });
    });

    it("should handle unexpected errors", async () => {
      const req = { body: {} };
      const res = mockRes();

      authService.register.mockRejectedValue(new Error("Unexpected"));

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Unexpected" });
    });
  });

  /* ===========================
     LOGIN (email OR username)
  ============================ */
  describe("login()", () => {
    it("should login successfully with email", async () => {
      const req = { body: { identifier: "test@test.com", password: "123456" } };
      const res = mockRes();

      authService.login.mockResolvedValue({
        token: "abc123",
        user: { id: 1, username: "Test" }
      });

      await authController.login(req, res);

      expect(res.json).toHaveBeenCalledWith({
        token: "abc123",
        user: { id: 1, username: "Test" }
      });
    });

    it("should login successfully with username", async () => {
      const req = { body: { identifier: "TestUser", password: "123456" } };
      const res = mockRes();

      authService.login.mockResolvedValue({
        token: "xyz789",
        user: { id: 2, username: "TestUser" }
      });

      await authController.login(req, res);

      expect(res.json).toHaveBeenCalledWith({
        token: "xyz789",
        user: { id: 2, username: "TestUser" }
      });
    });

    it("should return error for invalid credentials", async () => {
      const req = { body: { identifier: "wrong", password: "123456" } };
      const res = mockRes();

      authService.login.mockResolvedValue({ error: "Invalid credentials" });

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
    });

    it("should return error for missing identifier", async () => {
      const req = { body: { password: "123456" } };
      const res = mockRes();

      authService.login.mockResolvedValue({ error: "Missing fields" });

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Missing fields" });
    });

    it("should return error for missing password", async () => {
      const req = { body: { identifier: "test@test.com" } };
      const res = mockRes();

      authService.login.mockResolvedValue({ error: "Missing fields" });

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Missing fields" });
    });

    it("should handle unexpected errors", async () => {
      const req = { body: {} };
      const res = mockRes();

      authService.login.mockRejectedValue(new Error("Unexpected"));

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Unexpected" });
    });
  });
});

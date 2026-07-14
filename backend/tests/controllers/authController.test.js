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
  describe("register()", () => {
    it("should register a user successfully", async () => {
      const req = { body: { username: "Test", email: "test@test.com", password: "123" } };
      const res = mockRes();

      authService.register.mockResolvedValue({ user: { id: 1, username: "Test" } });

      await authController.register(req, res);

      expect(res.json).toHaveBeenCalledWith({
        message: "User registered",
        user: { id: 1, username: "Test" }
      });
    });

    it("should return error if email exists", async () => {
      const req = { body: { email: "test@test.com" } };
      const res = mockRes();

      authService.register.mockResolvedValue({ error: "Email already exists" });

      await authController.register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Email already exists" });
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

  describe("login()", () => {
    it("should login successfully", async () => {
      const req = { body: { email: "test@test.com", password: "123" } };
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

    it("should return error for invalid credentials", async () => {
      const req = { body: { email: "wrong@test.com", password: "123" } };
      const res = mockRes();

      authService.login.mockResolvedValue({ error: "Invalid credentials" });

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
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

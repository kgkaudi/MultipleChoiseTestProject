const authService = require("../../services/authService");
const authRepo = require("../../repositories/authRepository");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

jest.mock("../../repositories/authRepository");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Auth Service", () => {
  /* ===========================
     REGISTER
  =========================== */
  describe("register()", () => {
    it("should register a new user successfully", async () => {
      authRepo.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashed123");

      const mockUser = { _id: "1", username: "Test", email: "test@test.com" };
      authRepo.createUser.mockResolvedValue(mockUser);

      const result = await authService.register({
        username: "Test",
        email: "test@test.com",
        password: "123"
      });

      expect(result.user).toEqual(mockUser);
      expect(bcrypt.hash).toHaveBeenCalledWith("123", 10);
      expect(authRepo.createUser).toHaveBeenCalled();
    });

    it("should return error if email already exists", async () => {
      authRepo.findByEmail.mockResolvedValue({ email: "exists@test.com" });

      const result = await authService.register({
        username: "Test",
        email: "exists@test.com",
        password: "123"
      });

      expect(result.error).toBe("Email already exists");
    });

    it("should fail if password hashing throws error", async () => {
      authRepo.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockRejectedValue(new Error("Hash failed"));

      await expect(
        authService.register({
          username: "Test",
          email: "test@test.com",
          password: "123"
        })
      ).rejects.toThrow("Hash failed");
    });

    it("should fail if repository createUser throws error", async () => {
      authRepo.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashed123");
      authRepo.createUser.mockRejectedValue(new Error("DB error"));

      await expect(
        authService.register({
          username: "Test",
          email: "test@test.com",
          password: "123"
        })
      ).rejects.toThrow("DB error");
    });
  });

  /* ===========================
     LOGIN
  =========================== */
  describe("login()", () => {
    it("should login successfully", async () => {
      const mockUser = {
        _id: "1",
        email: "test@test.com",
        password: "hashed123",
        role: "user"
      };

      authRepo.findByEmail.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token123");

      const result = await authService.login({
        email: "test@test.com",
        password: "123"
      });

      expect(result.token).toBe("token123");
      expect(result.user).toEqual(mockUser);
      expect(jwt.sign).toHaveBeenCalled();
    });

    it("should return error if email does not exist", async () => {
      authRepo.findByEmail.mockResolvedValue(null);

      const result = await authService.login({
        email: "missing@test.com",
        password: "123"
      });

      expect(result.error).toBe("Invalid credentials");
    });

    it("should return error if password does not match", async () => {
      authRepo.findByEmail.mockResolvedValue({
        email: "test@test.com",
        password: "hashed123"
      });

      bcrypt.compare.mockResolvedValue(false);

      const result = await authService.login({
        email: "test@test.com",
        password: "wrong"
      });

      expect(result.error).toBe("Invalid credentials");
    });

    it("should fail if bcrypt.compare throws error", async () => {
      authRepo.findByEmail.mockResolvedValue({
        email: "test@test.com",
        password: "hashed123"
      });

      bcrypt.compare.mockRejectedValue(new Error("Compare failed"));

      await expect(
        authService.login({
          email: "test@test.com",
          password: "123"
        })
      ).rejects.toThrow("Compare failed");
    });

    it("should fail if jwt.sign throws error", async () => {
      authRepo.findByEmail.mockResolvedValue({
        _id: "1",
        email: "test@test.com",
        password: "hashed123",
        role: "user"
      });

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockImplementation(() => {
        throw new Error("JWT failed");
      });

      await expect(
        authService.login({
          email: "test@test.com",
          password: "123"
        })
      ).rejects.toThrow("JWT failed");
    });
  });
});

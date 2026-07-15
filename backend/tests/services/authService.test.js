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
      authRepo.findByUsername.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashed123");

      const mockUser = { _id: "1", username: "Test", email: "test@test.com" };
      authRepo.createUser.mockResolvedValue(mockUser);

      const result = await authService.register({
        username: "Test",
        email: "test@test.com",
        password: "123456"
      });

      expect(result.user).toEqual(mockUser);
      expect(bcrypt.hash).toHaveBeenCalledWith("123456", 10);
      expect(authRepo.createUser).toHaveBeenCalled();
    });

    it("should return error if email already exists", async () => {
      authRepo.findByEmail.mockResolvedValue({ email: "exists@test.com" });

      const result = await authService.register({
        username: "Test",
        email: "exists@test.com",
        password: "123456"
      });

      expect(result.error).toBe("Email already exists");
    });

    it("should return error if username already exists", async () => {
      authRepo.findByEmail.mockResolvedValue(null);
      authRepo.findByUsername.mockResolvedValue({ username: "Test" });

      const result = await authService.register({
        username: "Test",
        email: "new@test.com",
        password: "123456"
      });

      expect(result.error).toBe("Username already exists");
    });

    it("should return error for missing fields", async () => {
      const result = await authService.register({});
      expect(result.error).toBe("Missing fields");
    });

    it("should return error for invalid email format", async () => {
      const result = await authService.register({
        username: "Test",
        email: "not-an-email",
        password: "123456"
      });

      expect(result.error).toBe("Invalid email format");
    });

    it("should fail if password hashing throws error", async () => {
      authRepo.findByEmail.mockResolvedValue(null);
      authRepo.findByUsername.mockResolvedValue(null);
      bcrypt.hash.mockRejectedValue(new Error("Hash failed"));

      await expect(
        authService.register({
          username: "Test",
          email: "test@test.com",
          password: "123456"
        })
      ).rejects.toThrow("Hash failed");
    });

    it("should fail if repository createUser throws error", async () => {
      authRepo.findByEmail.mockResolvedValue(null);
      authRepo.findByUsername.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashed123");
      authRepo.createUser.mockRejectedValue(new Error("DB error"));

      await expect(
        authService.register({
          username: "Test",
          email: "test@test.com",
          password: "123456"
        })
      ).rejects.toThrow("DB error");
    });
  });

  /* ===========================
     LOGIN (email OR username)
  =========================== */
  describe("login()", () => {
    it("should login successfully with email", async () => {
      const mockUser = {
        _id: "1",
        email: "test@test.com",
        username: "Test",
        password: "hashed123",
        role: "user"
      };

      authRepo.findByEmail.mockResolvedValue(mockUser);
      authRepo.findByUsername.mockResolvedValue(null);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token123");

      const result = await authService.login({
        identifier: "test@test.com",
        password: "123456"
      });

      expect(result.token).toBe("token123");
      expect(result.user).toEqual(mockUser);
    });

    it("should login successfully with username", async () => {
      const mockUser = {
        _id: "1",
        email: "test@test.com",
        username: "Tester",
        password: "hashed123",
        role: "user"
      };

      authRepo.findByEmail.mockResolvedValue(null);
      authRepo.findByUsername.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("tokenXYZ");

      const result = await authService.login({
        identifier: "Tester",
        password: "123456"
      });

      expect(result.token).toBe("tokenXYZ");
      expect(result.user).toEqual(mockUser);
    });

    it("should return error for missing fields", async () => {
      const result = await authService.login({});
      expect(result.error).toBe("Missing fields");
    });

    it("should return error if user does not exist (email)", async () => {
      authRepo.findByEmail.mockResolvedValue(null);

      const result = await authService.login({
        identifier: "missing@test.com",
        password: "123456"
      });

      expect(result.error).toBe("Invalid credentials");
    });

    it("should return error if user does not exist (username)", async () => {
      authRepo.findByEmail.mockResolvedValue(null);
      authRepo.findByUsername.mockResolvedValue(null);

      const result = await authService.login({
        identifier: "UnknownUser",
        password: "123456"
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
        identifier: "test@test.com",
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
          identifier: "test@test.com",
          password: "123456"
        })
      ).rejects.toThrow("Compare failed");
    });

    it("should fail if jwt.sign throws error", async () => {
      authRepo.findByEmail.mockResolvedValue({
        _id: "1",
        email: "test@test.com",
        username: "Test",
        password: "hashed123",
        role: "user"
      });

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockImplementation(() => {
        throw new Error("JWT failed");
      });

      await expect(
        authService.login({
          identifier: "test@test.com",
          password: "123456"
        })
      ).rejects.toThrow("JWT failed");
    });
  });
});

const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const authRepo = require("../../repositories/authRepository");
const User = require("../../models/User");

jest.setTimeout(30000);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Auth Repository", () => {
  describe("createUser()", () => {
    it("should create a user successfully", async () => {
      const data = {
        username: "TestUser",
        email: "test@example.com",
        password: "hashedpassword"
      };

      const user = await authRepo.createUser(data);

      expect(user).toBeDefined();
      expect(user.username).toBe("TestUser");
      expect(user.email).toBe("test@example.com");
    });

    it("should fail when required fields are missing", async () => {
      const data = { email: "missing@fields.com" };

      await expect(authRepo.createUser(data)).rejects.toThrow();
    });

    it("should allow invalid email format because schema does not validate it", async () => {
      const data = {
        username: "BadEmailUser",
        email: "not-an-email",
        password: "hashedpassword"
      };

      const user = await authRepo.createUser(data);

      expect(user).toBeDefined();
      expect(user.email).toBe("not-an-email");
    });

    it("should fail when email already exists", async () => {
      const data = {
        username: "User1",
        email: "duplicate@test.com",
        password: "hashedpassword"
      };

      await authRepo.createUser(data);

      await expect(authRepo.createUser(data)).rejects.toThrow();
    });
  });

  describe("findByEmail()", () => {
    it("should find a user by email", async () => {
      const data = {
        username: "FindMe",
        email: "findme@test.com",
        password: "hashedpassword"
      };

      await authRepo.createUser(data);

      const user = await authRepo.findByEmail("findme@test.com");

      expect(user).toBeDefined();
      expect(user.username).toBe("FindMe");
    });

    it("should return null if email does not exist", async () => {
      const user = await authRepo.findByEmail("missing@test.com");
      expect(user).toBeNull();
    });

    it("should handle invalid email format", async () => {
      const user = await authRepo.findByEmail("not-an-email");
      expect(user).toBeNull();
    });

    it("should not crash when email is undefined", async () => {
      const user = await authRepo.findByEmail(undefined);
      expect(user).toBeNull();
    });

    it("should not crash when email is empty string", async () => {
      const user = await authRepo.findByEmail("");
      expect(user).toBeNull();
    });
  });
});

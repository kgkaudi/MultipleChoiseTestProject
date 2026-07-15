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
  /* ===========================
     CREATE USER
  ============================ */
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

    it("should lowercase email before saving", async () => {
      const data = {
        username: "CaseUser",
        email: "UPPER@TEST.COM",
        password: "hashedpassword"
      };

      const user = await authRepo.createUser(data);

      expect(user.email).toBe("upper@test.com");
    });

    it("should fail when required fields are missing", async () => {
      const data = { email: "missing@fields.com" };

      await expect(authRepo.createUser(data)).rejects.toThrow();
    });

    it("should allow invalid email format (schema does not validate)", async () => {
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

    it("should fail when username already exists", async () => {
      const data1 = {
        username: "SameUser",
        email: "first@test.com",
        password: "hashedpassword"
      };

      const data2 = {
        username: "SameUser",
        email: "second@test.com",
        password: "hashedpassword"
      };

      await authRepo.createUser(data1);

      await expect(authRepo.createUser(data2)).rejects.toThrow();
    });
  });

  /* ===========================
     FIND BY EMAIL
  ============================ */
  describe("findByEmail()", () => {
    it("should find a user by email", async () => {
      await authRepo.createUser({
        username: "FindMe",
        email: "findme@test.com",
        password: "hashedpassword"
      });

      const user = await authRepo.findByEmail("findme@test.com");

      expect(user).toBeDefined();
      expect(user.username).toBe("FindMe");
    });

    it("should find a user even if email case differs", async () => {
      await authRepo.createUser({
        username: "CaseInsensitive",
        email: "lower@test.com",
        password: "hashedpassword"
      });

      const user = await authRepo.findByEmail("LOWER@TEST.COM");

      expect(user).toBeDefined();
      expect(user.username).toBe("CaseInsensitive");
    });

    it("should return null if email does not exist", async () => {
      const user = await authRepo.findByEmail("missing@test.com");
      expect(user).toBeNull();
    });

    it("should return null for invalid email format", async () => {
      const user = await authRepo.findByEmail("not-an-email");
      expect(user).toBeNull();
    });

    it("should return null when email is undefined", async () => {
      const user = await authRepo.findByEmail(undefined);
      expect(user).toBeNull();
    });

    it("should return null when email is empty string", async () => {
      const user = await authRepo.findByEmail("");
      expect(user).toBeNull();
    });
  });

  /* ===========================
     FIND BY USERNAME
  ============================ */
  describe("findByUsername()", () => {
    it("should find a user by username", async () => {
      await authRepo.createUser({
        username: "FindUser",
        email: "finduser@test.com",
        password: "hashedpassword"
      });

      const user = await authRepo.findByUsername("FindUser");

      expect(user).toBeDefined();
      expect(user.email).toBe("finduser@test.com");
    });

    it("should return null if username does not exist", async () => {
      const user = await authRepo.findByUsername("UnknownUser");
      expect(user).toBeNull();
    });

    it("should return null when username is undefined", async () => {
      const user = await authRepo.findByUsername(undefined);
      expect(user).toBeNull();
    });

    it("should return null when username is empty string", async () => {
      const user = await authRepo.findByUsername("");
      expect(user).toBeNull();
    });
  });
});

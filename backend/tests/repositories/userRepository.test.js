const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const userRepo = require("../../repositories/userRepository");
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

describe("User Repository", () => {
  /* ===========================
     CREATE
  =========================== */
  describe("create()", () => {
    it("should create a user successfully", async () => {
      const data = {
        username: "TestUser",
        email: "test@example.com",
        password: "validpass",
        role: "user",
        quizSize: 10,
        canTakeQuiz: true
      };

      const user = await userRepo.create(data);

      expect(user).toBeDefined();
      expect(user.username).toBe("TestUser");
      expect(user.email).toBe("test@example.com");
    });

    it("should fail when required fields are missing", async () => {
      const data = { email: "missing@fields.com" };

      await expect(userRepo.create(data)).rejects.toThrow();
    });
  });

  /* ===========================
     FIND ALL
  =========================== */
  describe("findAll()", () => {
    it("should return all users", async () => {
      await userRepo.create({
        username: "UserA",
        email: "a@test.com",
        password: "validpass",
        role: "user"
      });

      await userRepo.create({
        username: "UserB",
        email: "b@test.com",
        password: "validpass",
        role: "admin"
      });

      const users = await userRepo.findAll();

      expect(users.length).toBe(2);
      expect(users[0].username).toBe("UserA");
      expect(users[1].username).toBe("UserB");
    });

    it("should return empty array when no users exist", async () => {
      const users = await userRepo.findAll();
      expect(users.length).toBe(0);
    });
  });

  /* ===========================
     FIND BY ID
  =========================== */
  describe("findById()", () => {
    it("should find a user by ID", async () => {
      const user = await userRepo.create({
        username: "FindMe",
        email: "find@test.com",
        password: "validpass",
        role: "user"
      });

      const found = await userRepo.findById(user._id);

      expect(found).toBeDefined();
      expect(found.username).toBe("FindMe");
    });

    it("should return null for non-existing ID", async () => {
      const found = await userRepo.findById("000000000000000000000000");
      expect(found).toBeNull();
    });

    it("should throw for invalid ID format", async () => {
      await expect(userRepo.findById("invalid-id")).rejects.toThrow();
    });
  });

  /* ===========================
     UPDATE BY ID
  =========================== */
  describe("updateById()", () => {
    it("should update a user successfully", async () => {
      const user = await userRepo.create({
        username: "OldUser",
        email: "old@test.com",
        password: "validpass",
        role: "user"
      });

      const updated = await userRepo.updateById(user._id, {
        username: "UpdatedUser"
      });

      expect(updated.username).toBe("UpdatedUser");
    });

    it("should return null when updating non-existing ID", async () => {
      const updated = await userRepo.updateById(
        "000000000000000000000000",
        { username: "UpdatedUser" }
      );
      expect(updated).toBeNull();
    });

    it("should throw for invalid ID format", async () => {
      await expect(
        userRepo.updateById("invalid-id", { username: "UpdatedUser" })
      ).rejects.toThrow();
    });
  });

  /* ===========================
     DELETE BY ID
  =========================== */
  describe("deleteById()", () => {
    it("should delete a user successfully", async () => {
      const user = await userRepo.create({
        username: "DeleteMe",
        email: "delete@test.com",
        password: "validpass",
        role: "user"
      });

      const deleted = await userRepo.deleteById(user._id);

      expect(deleted).toBeDefined();
      expect(deleted.username).toBe("DeleteMe");

      const check = await userRepo.findById(user._id);
      expect(check).toBeNull();
    });

    it("should return null when deleting non-existing ID", async () => {
      const deleted = await userRepo.deleteById(
        "000000000000000000000000"
      );
      expect(deleted).toBeNull();
    });

    it("should throw for invalid ID format", async () => {
      await expect(userRepo.deleteById("invalid-id")).rejects.toThrow();
    });
  });

  /* ===========================
     UPDATE MANY
  =========================== */
  describe("updateMany()", () => {
    it("should update multiple users", async () => {
      await userRepo.create({
        username: "UserA",
        email: "a@test.com",
        password: "validpass",
        role: "user",
        quizSize: 10
      });

      await userRepo.create({
        username: "UserB",
        email: "b@test.com",
        password: "validpass",
        role: "user",
        quizSize: 10
      });

      const result = await userRepo.updateMany(
        { role: "user" },
        { quizSize: 20 }
      );

      expect(result.modifiedCount).toBe(2);

      const users = await userRepo.findAll();
      expect(users[0].quizSize).toBe(20);
      expect(users[1].quizSize).toBe(20);
    });

    it("should not update anything if filter matches no users", async () => {
      const result = await userRepo.updateMany(
        { role: "admin" },
        { quizSize: 50 }
      );

      expect(result.modifiedCount).toBe(0);
    });
  });

  /* ===========================
     SAVE (instance save)
  =========================== */
  describe("save()", () => {
    it("should save a user instance", async () => {
      const user = await userRepo.create({
        username: "SaveMe",
        email: "save@test.com",
        password: "validpass",
        role: "user"
      });

      user.username = "SavedUser";

      const saved = await userRepo.save(user);

      expect(saved.username).toBe("SavedUser");
    });

    it("should throw if save fails", async () => {
      const user = new User({}); // missing required fields

      await expect(userRepo.save(user)).rejects.toThrow();
    });
  });
});

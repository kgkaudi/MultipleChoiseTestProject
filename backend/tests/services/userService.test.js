const userService = require("../../services/userService");
const userRepo = require("../../repositories/userRepository");
const bcrypt = require("bcryptjs");

jest.mock("../../repositories/userRepository");
jest.mock("bcryptjs");

describe("User Service", () => {
  /* ===========================
     CREATE USER
  =========================== */
  describe("createUser()", () => {
    it("should create a user", async () => {
      const data = { username: "Test", email: "test@test.com" };
      const mockUser = { id: "1", ...data };

      userRepo.create.mockResolvedValue(mockUser);

      const result = await userService.createUser(data);

      expect(result).toEqual(mockUser);
      expect(userRepo.create).toHaveBeenCalledWith(data);
    });

    it("should throw if repository throws", async () => {
      userRepo.create.mockRejectedValue(new Error("DB error"));

      await expect(userService.createUser({})).rejects.toThrow("DB error");
    });
  });

  /* ===========================
     GET USERS
  =========================== */
  describe("getUsers()", () => {
    it("should return all users", async () => {
      const mockUsers = [{ id: "1" }, { id: "2" }];
      userRepo.findAll.mockResolvedValue(mockUsers);

      const result = await userService.getUsers();

      expect(result).toEqual(mockUsers);
      expect(userRepo.findAll).toHaveBeenCalled();
    });

    it("should throw if repository fails", async () => {
      userRepo.findAll.mockRejectedValue(new Error("DB error"));

      await expect(userService.getUsers()).rejects.toThrow("DB error");
    });
  });

  /* ===========================
     GET USER BY ID
  =========================== */
  describe("getUserById()", () => {
    it("should return a user", async () => {
      const mockUser = { id: "123" };
      userRepo.findById.mockResolvedValue(mockUser);

      const result = await userService.getUserById("123");

      expect(result).toEqual(mockUser);
      expect(userRepo.findById).toHaveBeenCalledWith("123");
    });

    it("should return null if not found", async () => {
      userRepo.findById.mockResolvedValue(null);

      const result = await userService.getUserById("123");

      expect(result).toBeNull();
    });

    it("should throw if repository throws", async () => {
      userRepo.findById.mockRejectedValue(new Error("Invalid ID"));

      await expect(userService.getUserById("bad")).rejects.toThrow(
        "Invalid ID",
      );
    });
  });

  /* ===========================
     UPDATE USER
  =========================== */
  describe("updateUser()", () => {
    it("should update a user", async () => {
      const mockUser = { id: "123", username: "Updated" };
      userRepo.updateById.mockResolvedValue(mockUser);

      const result = await userService.updateUser("123", {
        username: "Updated",
      });

      expect(result).toEqual(mockUser);
      expect(userRepo.updateById).toHaveBeenCalledWith("123", {
        username: "Updated",
      });
    });

    it("should return null when user not found", async () => {
      userRepo.updateById.mockResolvedValue(null);

      const result = await userService.updateUser("123", {});

      expect(result).toBeNull();
    });

    it("should throw if repository throws", async () => {
      userRepo.updateById.mockRejectedValue(new Error("Update failed"));

      await expect(userService.updateUser("123", {})).rejects.toThrow(
        "Update failed",
      );
    });
  });

  /* ===========================
     UPDATE SCORE
  =========================== */
  describe("updateScore()", () => {
    it("should update score and lock quiz access", async () => {
      const mockUser = {
        id: "123",
        lastScore: 0,
        canTakeQuiz: true,
        save: jest.fn().mockResolvedValue(true),
      };

      userRepo.findById.mockResolvedValue(mockUser);

      const result = await userService.updateScore("123", 8);

      expect(mockUser.lastScore).toBe(8);
      expect(mockUser.canTakeQuiz).toBe(false);
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it("should return null if user not found", async () => {
      userRepo.findById.mockResolvedValue(null);

      const result = await userService.updateScore("123", 8);

      expect(result).toBeNull();
    });

    it("should throw if save fails", async () => {
      const mockUser = {
        id: "123",
        save: jest.fn().mockRejectedValue(new Error("Save failed")),
      };

      userRepo.findById.mockResolvedValue(mockUser);

      await expect(userService.updateScore("123", 8)).rejects.toThrow(
        "Save failed",
      );
    });
  });

  /* ===========================
     DELETE USER
  =========================== */
  describe("deleteUser()", () => {
    it("should delete a user", async () => {
      userRepo.deleteById.mockResolvedValue({ id: "123" });

      const result = await userService.deleteUser("123");

      expect(result).toEqual({ id: "123" });
      expect(userRepo.deleteById).toHaveBeenCalledWith("123");
    });

    it("should return null if user not found", async () => {
      userRepo.deleteById.mockResolvedValue(null);

      const result = await userService.deleteUser("123");

      expect(result).toBeNull();
    });

    it("should throw if repository throws", async () => {
      userRepo.deleteById.mockRejectedValue(new Error("Delete failed"));

      await expect(userService.deleteUser("123")).rejects.toThrow(
        "Delete failed",
      );
    });
  });

  /* ===========================
     SET QUIZ SIZE FOR ALL
  =========================== */
  describe("setQuizSizeForAll()", () => {
    it("should update quiz size for all users", async () => {
      userRepo.updateMany.mockResolvedValue({ modifiedCount: 5 });

      const result = await userService.setQuizSizeForAll(20);

      expect(result.modifiedCount).toBe(5);
      expect(userRepo.updateMany).toHaveBeenCalledWith({}, { quizSize: 20 });
    });

    it("should throw if repository fails", async () => {
      userRepo.updateMany.mockRejectedValue(new Error("DB error"));

      await expect(userService.setQuizSizeForAll(20)).rejects.toThrow(
        "DB error",
      );
    });
  });

  /* ===========================
     TOGGLE QUIZ ACCESS
  =========================== */
  describe("toggleQuizAccess()", () => {
    it("should toggle quiz access", async () => {
      const mockUser = {
        id: "123",
        canTakeQuiz: false,
        save: jest.fn().mockResolvedValue(true),
      };

      userRepo.findById.mockResolvedValue(mockUser);

      const result = await userService.toggleQuizAccess("123", true);

      expect(mockUser.canTakeQuiz).toBe(true);
      expect(mockUser.save).toHaveBeenCalled();
      expect(result).toEqual(mockUser);
    });

    it("should return null if user not found", async () => {
      userRepo.findById.mockResolvedValue(null);

      const result = await userService.toggleQuizAccess("123", true);

      expect(result).toBeNull();
    });

    it("should throw if save fails", async () => {
      const mockUser = {
        id: "123",
        save: jest.fn().mockRejectedValue(new Error("Save failed")),
      };

      userRepo.findById.mockResolvedValue(mockUser);

      await expect(userService.toggleQuizAccess("123", true)).rejects.toThrow(
        "Save failed",
      );
    });
  });

  /* ===========================
     GET PROFILE
  =========================== */
  describe("getProfile()", () => {
    it("should return user profile", async () => {
      const mockUser = { id: "123", username: "Test" };
      userRepo.findById.mockResolvedValue(mockUser);

      const result = await userService.getProfile("123");

      expect(result).toEqual(mockUser);
    });

    it("should throw if user not found", async () => {
      userRepo.findById.mockResolvedValue(null);

      await expect(userService.getProfile("123")).rejects.toThrow(
        "User not found",
      );
    });
  });

  /* ===========================
     CHANGE PASSWORD
  =========================== */
  describe("changePassword()", () => {
    it("should change password successfully", async () => {
      const mockUser = {
        id: "123",
        password: "oldhash",
      };

      userRepo.findById.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue("newhash");
      userRepo.save.mockResolvedValue(true);

      const result = await userService.changePassword("123", "old", "new");

      expect(mockUser.password).toBe("newhash");
      expect(userRepo.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual({ message: "Password updated successfully" });
    });

    it("should throw if user not found", async () => {
      userRepo.findById.mockResolvedValue(null);

      await expect(
        userService.changePassword("123", "old", "new"),
      ).rejects.toThrow("User not found");
    });

    it("should throw if current password is incorrect", async () => {
      const mockUser = { id: "123", password: "oldhash" };

      userRepo.findById.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        userService.changePassword("123", "wrong", "new"),
      ).rejects.toThrow("Incorrect current password");
    });

    it("should throw if hashing fails", async () => {
      const mockUser = {
        id: "123",
        password: "oldhash",
        save: jest.fn(),
      };

      userRepo.findById.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockRejectedValue(new Error("Hash failed"));

      await expect(
        userService.changePassword("123", "old", "new"),
      ).rejects.toThrow("Hash failed");
    });
  });
});

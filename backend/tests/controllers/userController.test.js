const userController = require("../../controllers/userController");
const userService = require("../../services/userService");
const mongoose = require("mongoose");

jest.mock("../../services/userService");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("User Controller", () => {

  /* ===========================
     CREATE USER
  =========================== */
  describe("createUser()", () => {
    it("should create a user successfully", async () => {
      const req = { body: { username: "Test", email: "test@test.com" } };
      const res = mockRes();

      userService.createUser.mockResolvedValue({ id: 1, username: "Test" });

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 1, username: "Test" });
    });

    it("should return 400 on error", async () => {
      const req = { body: {} };
      const res = mockRes();

      userService.createUser.mockRejectedValue(new Error("Invalid data"));

      await userController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid data" });
    });
  });

  /* ===========================
     GET ALL USERS
  =========================== */
  describe("getUsers()", () => {
    it("should return all users", async () => {
      const req = {};
      const res = mockRes();

      userService.getUsers.mockResolvedValue([
        { id: 1, username: "A" },
        { id: 2, username: "B" }
      ]);

      await userController.getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { id: 1, username: "A" },
        { id: 2, username: "B" }
      ]);
    });

    it("should return 400 on error", async () => {
      const req = {};
      const res = mockRes();

      userService.getUsers.mockRejectedValue(new Error("DB error"));

      await userController.getUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });
  });

  /* ===========================
     GET USER BY ID
  =========================== */
  describe("getUserById()", () => {

    it("should return a user", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id } };
      const res = mockRes();

      userService.getUserById.mockResolvedValue({ id, username: "Test" });

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id, username: "Test" });
    });

    it("should return 404 if user not found", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id } };
      const res = mockRes();

      userService.getUserById.mockResolvedValue(null);

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 404 for invalid ObjectId", async () => {
      const req = { params: { id: "123" } };
      const res = mockRes();

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 400 on service error", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id } };
      const res = mockRes();

      userService.getUserById.mockRejectedValue(new Error("Invalid ID"));

      await userController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid ID" });
    });
  });

  /* ===========================
     UPDATE USER
  =========================== */
  describe("updateUser()", () => {

    it("should update a user", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id }, body: { username: "Updated" } };
      const res = mockRes();

      userService.updateUser.mockResolvedValue({ id, username: "Updated" });

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id, username: "Updated" });
    });

    it("should return 404 if user not found", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id }, body: {} };
      const res = mockRes();

      userService.updateUser.mockResolvedValue(null);

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 404 for invalid ObjectId", async () => {
      const req = { params: { id: "123" }, body: {} };
      const res = mockRes();

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 400 on service error", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id }, body: {} };
      const res = mockRes();

      userService.updateUser.mockRejectedValue(new Error("Update failed"));

      await userController.updateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Update failed" });
    });
  });

  /* ===========================
     UPDATE SCORE
  =========================== */
  describe("updateScore()", () => {

    it("should update score successfully", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id }, body: { lastScore: 8 } };
      const res = mockRes();

      userService.updateScore.mockResolvedValue({
        id,
        lastScore: 8,
        canTakeQuiz: false
      });

      await userController.updateScore(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Score updated and quiz access locked.",
        user: {
          id,
          lastScore: 8,
          canTakeQuiz: false
        }
      });
    });

    it("should return 404 if user not found", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id }, body: { lastScore: 8 } };
      const res = mockRes();

      userService.updateScore.mockResolvedValue(null);

      await userController.updateScore(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 500 on error", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id }, body: { lastScore: 8 } };
      const res = mockRes();

      userService.updateScore.mockRejectedValue(new Error("DB error"));

      await userController.updateScore(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to update score" });
    });
  });

  /* ===========================
     DELETE USER
  =========================== */
  describe("deleteUser()", () => {

    it("should delete a user", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id } };
      const res = mockRes();

      userService.deleteUser.mockResolvedValue({ id });

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "User deleted" });
    });

    it("should return 404 if user not found", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id } };
      const res = mockRes();

      userService.deleteUser.mockResolvedValue(null);

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 404 for invalid ObjectId", async () => {
      const req = { params: { id: "123" } };
      const res = mockRes();

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 400 on service error", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id } };
      const res = mockRes();

      userService.deleteUser.mockRejectedValue(new Error("Delete failed"));

      await userController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Delete failed" });
    });
  });

  /* ===========================
     SET QUIZ SIZE FOR ALL
  =========================== */
  describe("setQuizSizeForAll()", () => {

    it("should update quiz size for all users", async () => {
      const req = { body: { quizSize: 15 } };
      const res = mockRes();

      userService.setQuizSizeForAll.mockResolvedValue();

      await userController.setQuizSizeForAll(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Quiz size set to 15 for all users."
      });
    });

    it("should return 400 for invalid quiz size", async () => {
      const req = { body: { quizSize: "abc" } };
      const res = mockRes();

      await userController.setQuizSizeForAll(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid quiz size" });
    });

    it("should return 500 on error", async () => {
      const req = { body: { quizSize: 10 } };
      const res = mockRes();

      userService.setQuizSizeForAll.mockRejectedValue(new Error("DB error"));

      await userController.setQuizSizeForAll(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
    });
  });

  /* ===========================
     TOGGLE QUIZ ACCESS
  =========================== */
  describe("toggleQuizAccess()", () => {

    it("should toggle quiz access", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id }, body: { canTakeQuiz: true } };
      const res = mockRes();

      userService.toggleQuizAccess.mockResolvedValue({
        _id: id,
        canTakeQuiz: true
      });

      await userController.toggleQuizAccess(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        userId: id,
        canTakeQuiz: true
      });
    });

    it("should return 404 if user not found", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id }, body: { canTakeQuiz: true } };
      const res = mockRes();

      userService.toggleQuizAccess.mockResolvedValue(null);

      await userController.toggleQuizAccess(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 404 for invalid ObjectId", async () => {
      const req = { params: { id: "123" }, body: { canTakeQuiz: true } };
      const res = mockRes();

      await userController.toggleQuizAccess(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should return 500 on error", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id }, body: { canTakeQuiz: true } };
      const res = mockRes();

      userService.toggleQuizAccess.mockRejectedValue(new Error("DB error"));

      await userController.toggleQuizAccess(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to update quiz access"
      });
    });
  });

  /* ===========================
     GET PROFILE
  =========================== */
  describe("getProfile()", () => {

    it("should return user profile", async () => {
      const req = { user: { id: "123" } };
      const res = mockRes();

      userService.getProfile.mockResolvedValue({
        _id: "123",
        username: "Test",
        email: "test@test.com",
        role: "user",
        canTakeQuiz: true,
        quizSize: 10
      });

      await userController.getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id: "123",
        name: "Test",
        email: "test@test.com",
        role: "user",
        canTakeQuiz: true,
        quizSize: 10
      });
    });

    it("should return 400 on error", async () => {
      const req = { user: { id: "123" } };
      const res = mockRes();

      userService.getProfile.mockRejectedValue(new Error("Invalid ID"));

      await userController.getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid ID" });
    });
  });

  /* ===========================
     CHANGE PASSWORD
  =========================== */
  describe("changePassword()", () => {

    it("should change password successfully", async () => {
      const req = {
        user: { id: "123" },
        body: { current: "old", new: "newpass" }
      };
      const res = mockRes();

      userService.changePassword.mockResolvedValue({
        success: true,
        message: "Password changed"
      });

      await userController.changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Password changed"
      });
    });

    it("should return 400 on error", async () => {
      const req = {
        user: { id: "123" },
        body: { current: "old", new: "newpass" }
      };
      const res = mockRes();

      userService.changePassword.mockRejectedValue(new Error("Wrong password"));

      await userController.changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Wrong password" });
    });
  });
});

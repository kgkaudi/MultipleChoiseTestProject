const questionController = require("../../controllers/questionController");
const questionService = require("../../services/questionService");
const mongoose = require("mongoose");

jest.mock("../../services/questionService");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Question Controller", () => {

  describe("getQuestionById()", () => {

    it("should return a question", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id } };
      const res = mockRes();

      questionService.getQuestionById.mockResolvedValue({
        id,
        question: "Q1"
      });

      await questionController.getQuestionById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id,
        question: "Q1"
      });
    });

    it("should return 404 if not found", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id } };
      const res = mockRes();

      questionService.getQuestionById.mockResolvedValue(null);

      await questionController.getQuestionById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Question not found" });
    });

    it("should return 404 for invalid ID", async () => {
      const req = { params: { id: "123" } };
      const res = mockRes();

      await questionController.getQuestionById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Question not found" });
    });
  });

  describe("updateQuestion()", () => {

    it("should update a question", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id }, body: { question: "Updated" } };
      const res = mockRes();

      questionService.updateQuestion.mockResolvedValue({
        id,
        question: "Updated"
      });

      await questionController.updateQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        id,
        question: "Updated"
      });
    });

    it("should return 404 if not found", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id }, body: {} };
      const res = mockRes();

      questionService.updateQuestion.mockResolvedValue(null);

      await questionController.updateQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Question not found" });
    });

    it("should return 404 for invalid ID", async () => {
      const req = { params: { id: "123" }, body: {} };
      const res = mockRes();

      await questionController.updateQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Question not found" });
    });
  });

  describe("deleteQuestion()", () => {

    it("should delete a question", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id } };
      const res = mockRes();

      questionService.deleteQuestion.mockResolvedValue({});

      await questionController.deleteQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Question deleted" });
    });

    it("should return 404 if not found", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id } };
      const res = mockRes();

      questionService.deleteQuestion.mockResolvedValue(null);

      await questionController.deleteQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Question not found" });
    });

    it("should return 404 for invalid ID", async () => {
      const req = { params: { id: "123" } };
      const res = mockRes();

      await questionController.deleteQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Question not found" });
    });
  });
});

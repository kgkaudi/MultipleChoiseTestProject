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
  beforeEach(() => jest.clearAllMocks());

  /* ===========================
     CREATE QUESTION
  ============================ */
  describe("createQuestion()", () => {
    it("should create a valid question", async () => {
      const req = {
        body: {
          question: "What is 2+2?",
          answers: ["3", "4", "5", "6"],
          correctIndex: 1,
          category: "math",
          difficulty: "hard",
        },
      };
      const res = mockRes();

      questionService.createQuestion.mockResolvedValue(req.body);

      await questionController.createQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(req.body);
    });

    it("should return 400 if question text is missing", async () => {
      const req = {
        body: {
          answers: ["a", "a", "b", "a"],
          correctIndex: 0,
          category: "test",
          difficulty: "easy",
        },
      };
      const res = mockRes();

      await questionController.createQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Question text is required",
      });
    });

    it("should return 400 if answers array is empty", async () => {
      const req = {
        body: {
          question: "Q",
          answers: [],
          correctIndex: 0,
          category: "test",
          difficulty: "easy",
        },
      };
      const res = mockRes();

      await questionController.createQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Answers must be a non-empty array",
      });
    });

    it("should return 400 if correctIndex is invalid", async () => {
      const req = {
        body: {
          question: "Q",
          answers: ["a", "b", "a", "b"],
          correctIndex: 5,
          category: "test",
          difficulty: "easy",
        },
      };
      const res = mockRes();

      await questionController.createQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid correctIndex" });
    });

    it("should handle service errors", async () => {
      const req = {
        body: {
          question: "Q",
          answers: ["a", "a", "b", "a"],
          correctIndex: 0,
          category: "test",
          difficulty: "easy", // REQUIRED so controller reaches service
        },
      };
      const res = mockRes();

      questionService.createQuestion.mockRejectedValue(new Error("DB error"));

      await questionController.createQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });
  });

  /* ===========================
     GET ALL QUESTIONS
  ============================ */
  describe("getQuestions()", () => {
    it("should return all questions", async () => {
      const req = {};
      const res = mockRes();

      questionService.getQuestions.mockResolvedValue([{ question: "Q1" }]);

      await questionController.getQuestions(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ question: "Q1" }]);
    });

    it("should handle service errors", async () => {
      const req = {};
      const res = mockRes();

      questionService.getQuestions.mockRejectedValue(new Error("DB error"));

      await questionController.getQuestions(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });
  });

  /* ===========================
     GET QUESTION BY ID
  ============================ */
  describe("getQuestionById()", () => {
    it("should return a question", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id } };
      const res = mockRes();

      questionService.getQuestionById.mockResolvedValue({ id, question: "Q1" });

      await questionController.getQuestionById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id, question: "Q1" });
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

    it("should handle service errors", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id } };
      const res = mockRes();

      questionService.getQuestionById.mockRejectedValue(new Error("DB error"));

      await questionController.getQuestionById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });
  });

  /* ===========================
     UPDATE QUESTION
  ============================ */
  describe("updateQuestion()", () => {
    it("should update a question", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = {
        params: { id },
        body: {
          question: "Updated",
          answers: ["a", "b", "a", "b"],
          correctIndex: 0,
          category: "general",
          difficulty: "easy",
        },
      };
      const res = mockRes();

      questionService.getQuestionById.mockResolvedValue({
        id,
        question: "Old",
      });
      questionService.updateQuestion.mockResolvedValue({
        id,
        question: "Updated",
      });

      await questionController.updateQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id, question: "Updated" });
    });

    it("should return 404 if not found", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = {
        params: { id },
        body: {
          question: "Updated",
          answers: ["a", "b", "a", "b"],
          correctIndex: 0,
          category: "general",
          difficulty: "easy",
        },
      };
      const res = mockRes();

      questionService.getQuestionById.mockResolvedValue(null);

      await questionController.updateQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Question not found" });
    });

    it("should return 400 for empty question text", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id }, body: { question: "" } };
      const res = mockRes();

      questionService.getQuestionById.mockResolvedValue({
        id,
        question: "Old",
      });

      await questionController.updateQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Question text cannot be empty",
      });
    });

    it("should return 400 for invalid answers array", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id }, body: { answers: [] } };
      const res = mockRes();

      questionService.getQuestionById.mockResolvedValue({
        id,
        question: "Old",
      });

      await questionController.updateQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Answers must be a non-empty array",
      });
    });

    it("should return 400 for invalid correctIndex", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = {
        params: { id },
        body: { answers: ["a", "b", "a", "b"], correctIndex: 5 },
      };
      const res = mockRes();

      questionService.getQuestionById.mockResolvedValue({
        id,
        question: "Old",
      });

      await questionController.updateQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid correctIndex" });
    });

    it("should handle service errors", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = {
        params: { id },
        body: {
          question: "Updated",
          answers: ["a", "b", "a", "b"],
          correctIndex: 0,
          category: "general",
          difficulty: "easy",
        },
      };
      const res = mockRes();

      questionService.getQuestionById.mockResolvedValue({
        id,
        question: "Old",
      });
      questionService.updateQuestion.mockRejectedValue(new Error("DB error"));

      await questionController.updateQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });
  });

  /* ===========================
     DELETE QUESTION
  ============================ */
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

    it("should handle service errors", async () => {
      const id = new mongoose.Types.ObjectId().toString();
      const req = { params: { id } };
      const res = mockRes();

      questionService.deleteQuestion.mockRejectedValue(new Error("DB error"));

      await questionController.deleteQuestion(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "DB error" });
    });
  });
});

const questionService = require("../../services/questionService");
const questionRepo = require("../../repositories/questionRepository");

jest.mock("../../repositories/questionRepository");

describe("Question Service", () => {
  beforeEach(() => jest.clearAllMocks());

  /* ===========================
     CREATE QUESTION
  ============================ */
  describe("createQuestion()", () => {
    it("should create a question successfully", async () => {
      const data = {
        question: "What is 2+2?",
        answers: ["1", "2", "3", "4"],
        correctIndex: 3,
        category: "math",
        difficulty: "hard",
      };

      const mockQuestion = { id: "1", ...data };
      questionRepo.create.mockResolvedValue(mockQuestion);

      const result = await questionService.createQuestion(data);

      expect(result).toEqual(mockQuestion);
      expect(questionRepo.create).toHaveBeenCalledWith(data);
    });

    it("should throw if repository throws", async () => {
      questionRepo.create.mockRejectedValue(new Error("Create failed"));

      await expect(
        questionService.createQuestion({ question: "Bad" }),
      ).rejects.toThrow("Create failed");
    });

    it("should pass difficulty through unchanged", async () => {
      const data = {
        question: "Difficulty test",
        answers: ["A", "B"],
        correctIndex: 0,
        category: "general",
        difficulty: "medium",
      };

      questionRepo.create.mockResolvedValue({ id: "1", ...data });

      const result = await questionService.createQuestion(data);

      expect(result.difficulty).toBe("medium");
    });
  });

  /* ===========================
     GET ALL QUESTIONS
  ============================ */
  describe("getQuestions()", () => {
    it("should return all questions", async () => {
      const mockQuestions = [
        { id: "1", question: "Q1" },
        { id: "2", question: "Q2" },
      ];

      questionRepo.findAll.mockResolvedValue(mockQuestions);

      const result = await questionService.getQuestions();

      expect(result).toEqual(mockQuestions);
      expect(questionRepo.findAll).toHaveBeenCalled();
    });

    it("should throw if repository fails", async () => {
      questionRepo.findAll.mockRejectedValue(new Error("DB error"));

      await expect(questionService.getQuestions()).rejects.toThrow("DB error");
    });
  });

  /* ===========================
     GET QUESTION BY ID
  ============================ */
  describe("getQuestionById()", () => {
    it("should return a question by ID", async () => {
      const mockQuestion = { id: "123", question: "Find me" };

      questionRepo.findById.mockResolvedValue(mockQuestion);

      const result = await questionService.getQuestionById("123");

      expect(result).toEqual(mockQuestion);
      expect(questionRepo.findById).toHaveBeenCalledWith("123");
    });

    it("should return null if not found", async () => {
      questionRepo.findById.mockResolvedValue(null);

      const result = await questionService.getQuestionById("123");

      expect(result).toBeNull();
    });

    it("should throw if repository throws", async () => {
      questionRepo.findById.mockRejectedValue(new Error("Invalid ID"));

      await expect(questionService.getQuestionById("bad-id")).rejects.toThrow(
        "Invalid ID",
      );
    });
  });

  /* ===========================
     UPDATE QUESTION
  ============================ */
  describe("updateQuestion()", () => {
    it("should update a question successfully", async () => {
      const mockUpdated = { id: "123", question: "Updated" };

      questionRepo.updateById.mockResolvedValue(mockUpdated);

      const result = await questionService.updateQuestion("123", {
        question: "Updated",
      });

      expect(result).toEqual(mockUpdated);
      expect(questionRepo.updateById).toHaveBeenCalledWith(
        "123",
        { question: "Updated" },
        expect.objectContaining({
          new: true,
          runValidators: true,
          context: "query",
        }),
      );
    });

    it("should return null when updating non-existing ID", async () => {
      questionRepo.updateById.mockResolvedValue(null);

      const result = await questionService.updateQuestion("123", {
        question: "Updated",
      });

      expect(result).toBeNull();
    });

    it("should throw if repository throws", async () => {
      questionRepo.updateById.mockRejectedValue(new Error("Update failed"));

      await expect(
        questionService.updateQuestion("123", { question: "Updated" }),
      ).rejects.toThrow("Update failed");
    });

    it("should pass difficulty through unchanged", async () => {
      const mockUpdated = {
        id: "123",
        question: "Updated",
        difficulty: "hard",
      };

      questionRepo.updateById.mockResolvedValue(mockUpdated);

      const result = await questionService.updateQuestion("123", {
        difficulty: "hard",
      });

      expect(result.difficulty).toBe("hard");
    });

    it("should pass answers array through unchanged", async () => {
      const mockUpdated = {
        id: "123",
        answers: ["A", "B"],
        correctIndex: 1,
      };

      questionRepo.updateById.mockResolvedValue(mockUpdated);

      const result = await questionService.updateQuestion("123", {
        answers: ["A", "B"],
        correctIndex: 1,
      });

      expect(result.answers).toEqual(["A", "B"]);
      expect(result.correctIndex).toBe(1);
    });
  });

  /* ===========================
     DELETE QUESTION
  ============================ */
  describe("deleteQuestion()", () => {
    it("should delete a question successfully", async () => {
      questionRepo.deleteById.mockResolvedValue({ id: "123" });

      const result = await questionService.deleteQuestion("123");

      expect(result).toEqual({ id: "123" });
      expect(questionRepo.deleteById).toHaveBeenCalledWith("123");
    });

    it("should return null when deleting non-existing ID", async () => {
      questionRepo.deleteById.mockResolvedValue(null);

      const result = await questionService.deleteQuestion("123");

      expect(result).toBeNull();
    });

    it("should throw if repository throws", async () => {
      questionRepo.deleteById.mockRejectedValue(new Error("Delete failed"));

      await expect(questionService.deleteQuestion("123")).rejects.toThrow(
        "Delete failed",
      );
    });
  });
});

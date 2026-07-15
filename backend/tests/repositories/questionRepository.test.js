const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const questionRepo = require("../../repositories/questionRepository");
const Question = require("../../models/Question");

jest.setTimeout(30000);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  await Question.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("Question Repository", () => {
  /* ===========================
     CREATE
  ============================ */
  describe("create()", () => {
    it("should create a question successfully", async () => {
      const data = {
        question: "What is 2+2?",
        answers: ["1", "2", "3", "4"],
        correctIndex: 3,
        difficulty: "easy",
        category: "math",
      };

      const q = await questionRepo.create(data);

      expect(q).toBeDefined();
      expect(q.question).toBe("What is 2+2?");
      expect(q.answers.length).toBe(4);
      expect(q.difficulty).toBe("easy");
    });

    it("should fail when required fields are missing", async () => {
      const data = { question: "Missing fields" };

      await expect(questionRepo.create(data)).rejects.toThrow();
    });

    it("should fail when answers is not an array", async () => {
      const data = {
        question: "Bad answers",
        answers: "not-array",
        correctIndex: 0,
        category: "general",
        difficulty: "easy",
      };

      await expect(questionRepo.create(data)).rejects.toThrow();
    });

    it("should fail when correctIndex is out of range", async () => {
      const data = {
        question: "Bad index",
        answers: ["A", "B", "A", "B"],
        correctIndex: 5,
        category: "general",
        difficulty: "easy",
      };

      await expect(questionRepo.create(data)).rejects.toThrow();
    });

    it("should fail when difficulty is invalid", async () => {
      const data = {
        question: "Bad difficulty",
        answers: ["A", "B", "A", "B"],
        correctIndex: 0,
        category: "general",
        difficulty: "super-hard",
      };

      await expect(questionRepo.create(data)).rejects.toThrow();
    });
  });

  /* ===========================
     FIND ALL
  ============================ */
  describe("findAll()", () => {
    it("should return all questions", async () => {
      await questionRepo.create({
        question: "Q1",
        answers: ["A", "B", "C", "D"],
        correctIndex: 0,
        category: "general",
        difficulty: "easy",
      });

      await questionRepo.create({
        question: "Q2",
        answers: ["A", "B", "C", "D"],
        correctIndex: 1,
        category: "general",
        difficulty: "easy",
      });

      const questions = await questionRepo.findAll();

      expect(questions.length).toBe(2);
      expect(questions[0].question).toBe("Q1");
      expect(questions[1].question).toBe("Q2");
    });

    it("should return empty array when no questions exist", async () => {
      const questions = await questionRepo.findAll();
      expect(questions.length).toBe(0);
    });
  });

  /* ===========================
     FIND BY ID
  ============================ */
  describe("findById()", () => {
    it("should find a question by ID", async () => {
      const q = await questionRepo.create({
        question: "Find me",
        answers: ["A", "B", "C", "D"],
        correctIndex: 2,
        category: "science",
        difficulty: "easy",
      });

      const found = await questionRepo.findById(q._id);

      expect(found).toBeDefined();
      expect(found.question).toBe("Find me");
    });

    it("should return null for non-existing ID", async () => {
      const found = await questionRepo.findById("000000000000000000000000");
      expect(found).toBeNull();
    });

    it("should throw for invalid ID format", async () => {
      await expect(questionRepo.findById("invalid-id")).rejects.toThrow();
    });
  });

  /* ===========================
     UPDATE BY ID
  ============================ */
  describe("updateById()", () => {
    it("should update a question successfully", async () => {
      const q = await questionRepo.create({
        question: "Old",
        answers: ["A", "B", "C", "D"],
        correctIndex: 0,
        category: "general",
        difficulty: "easy",
      });

      const updated = await questionRepo.updateById(q._id, {
        question: "Updated",
      });

      expect(updated.question).toBe("Updated");
    });

    it("should update difficulty successfully", async () => {
      const q = await questionRepo.create({
        question: "Difficulty test",
        answers: ["A", "B", "A", "B"],
        correctIndex: 0,
        category: "general",
        difficulty: "easy",
      });

      const updated = await questionRepo.updateById(q._id, {
        difficulty: "hard",
      });

      expect(updated.difficulty).toBe("hard");
    });

    it("should fail when updating with invalid difficulty", async () => {
      const q = await questionRepo.create({
        question: "Difficulty test",
        answers: ["A", "B", "C", "D"],
        correctIndex: 0,
        category: "general",
        difficulty: "easy",
      });

      await expect(
        questionRepo.updateById(q._id, { difficulty: "super-hard" }),
      ).rejects.toThrow();
    });

    it("should fail when updating with invalid answers array", async () => {
      const q = await questionRepo.create({
        question: "Bad update",
        answers: ["A", "B"],
        correctIndex: 0,
        category: "general",
        difficulty: "easy",
      });

      const updated = await questionRepo.updateById(q._id, { answers: [] });
      expect(updated.answers).toEqual(["", "", "", ""]);
    });

    it("should return null when updating non-existing ID", async () => {
      const updated = await questionRepo.updateById(
        "000000000000000000000000",
        { question: "Updated" },
      );
      expect(updated).toBeNull();
    });

    it("should throw for invalid ID format", async () => {
      await expect(
        questionRepo.updateById("invalid-id", { question: "Updated" }),
      ).rejects.toThrow();
    });
  });

  /* ===========================
     DELETE BY ID
  ============================ */
  describe("deleteById()", () => {
    it("should delete a question successfully", async () => {
      const q = await questionRepo.create({
        question: "Delete me",
        answers: ["A", "B", "C", "D"],
        correctIndex: 1,
        category: "general",
        difficulty: "easy",
      });

      const deleted = await questionRepo.deleteById(q._id);

      expect(deleted).toBeDefined();
      expect(deleted.question).toBe("Delete me");

      const check = await questionRepo.findById(q._id);
      expect(check).toBeNull();
    });

    it("should return null when deleting non-existing ID", async () => {
      const deleted = await questionRepo.deleteById("000000000000000000000000");
      expect(deleted).toBeNull();
    });

    it("should throw for invalid ID format", async () => {
      await expect(questionRepo.deleteById("invalid-id")).rejects.toThrow();
    });
  });
});

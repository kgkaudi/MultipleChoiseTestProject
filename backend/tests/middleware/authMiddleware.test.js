const jwt = require("jsonwebtoken");
const { protect, adminOnly } = require("../../middleware/authMiddleware");

jest.mock("jsonwebtoken");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("authMiddleware.protect", () => {

  it("should return 401 if no Authorization header", () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
  });

  it("should return 401 if token is malformed", () => {
    const req = { headers: { authorization: "Bearer" } };
    const res = mockRes();
    const next = jest.fn();

    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
  });

  it("should attach decoded user and call next()", () => {
    const req = { headers: { authorization: "Bearer validtoken" } };
    const res = mockRes();
    const next = jest.fn();

    jwt.verify.mockReturnValue({ id: "123", role: "user" });

    protect(req, res, next);

    expect(req.user).toEqual({ id: "123", role: "user" });
    expect(next).toHaveBeenCalled();
  });
});

describe("authMiddleware.adminOnly", () => {

  it("should return 403 if user is not admin", () => {
    const req = { user: { role: "user" } };
    const res = mockRes();
    const next = jest.fn();

    adminOnly(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Admin access only" });
  });

  it("should call next() if admin", () => {
    const req = { user: { role: "admin" } };
    const res = mockRes();
    const next = jest.fn();

    adminOnly(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

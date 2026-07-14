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

  it("returns 401 if Authorization header is missing", () => {
    const req = { headers: {} };
    const res = mockRes();
    const next = jest.fn();

    protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "No token provided" });
  });

  it("returns 401 if Authorization header is not Bearer format", () => {
    const req = { headers: { authorization: "Token abc123" } };
    const res = mockRes();
    const next = jest.fn();

    protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
  });

  it("returns 401 if Bearer prefix exists but token is missing", () => {
    const req = { headers: { authorization: "Bearer " } };
    const res = mockRes();
    const next = jest.fn();

    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
  });

  it("returns 401 if token is malformed", () => {
    const req = { headers: { authorization: "Bearer malformed" } };
    const res = mockRes();
    const next = jest.fn();

    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
  });

  it("returns 401 if jwt.verify throws a non-Error value", () => {
    const req = { headers: { authorization: "Bearer bad" } };
    const res = mockRes();
    const next = jest.fn();

    jwt.verify.mockImplementation(() => {
      throw "boom"; // non-Error
    });

    protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
  });

  it("returns 401 if token is expired", () => {
    const req = { headers: { authorization: "Bearer expired" } };
    const res = mockRes();
    const next = jest.fn();

    jwt.verify.mockImplementation(() => {
      const err = new Error("jwt expired");
      err.name = "TokenExpiredError";
      throw err;
    });

    protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
  });

  it("returns 401 if token has invalid signature", () => {
    const req = { headers: { authorization: "Bearer invalidsig" } };
    const res = mockRes();
    const next = jest.fn();

    jwt.verify.mockImplementation(() => {
      const err = new Error("invalid signature");
      err.name = "JsonWebTokenError";
      throw err;
    });

    protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
  });

  it("returns 401 if decoded token lacks required fields", () => {
    const req = { headers: { authorization: "Bearer valid" } };
    const res = mockRes();
    const next = jest.fn();

    jwt.verify.mockReturnValue({}); // missing id, role

    protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token" });
  });

  it("attaches decoded user and calls next()", () => {
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

  it("returns 403 if req.user is missing", () => {
    const req = {};
    const res = mockRes();
    const next = jest.fn();

    adminOnly(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Admin access only" });
  });

  it("returns 403 if req.user.role is missing", () => {
    const req = { user: {} };
    const res = mockRes();
    const next = jest.fn();

    adminOnly(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Admin access only" });
  });

  it("returns 403 if user is not admin", () => {
    const req = { user: { role: "user" } };
    const res = mockRes();
    const next = jest.fn();

    adminOnly(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Admin access only" });
  });

  it("returns 403 if role casing is wrong (e.g., 'Admin')", () => {
    const req = { user: { role: "Admin" } };
    const res = mockRes();
    const next = jest.fn();

    adminOnly(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Admin access only" });
  });

  it("calls next() if admin", () => {
    const req = { user: { role: "admin" } };
    const res = mockRes();
    const next = jest.fn();

    adminOnly(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});

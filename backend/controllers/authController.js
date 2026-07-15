const authService = require("../services/authService");

/* ===========================
   REGISTER
=========================== */
exports.register = async (req, res) => {
  try {
    const result = await authService.register(req.body);

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({
      message: "User registered",
      user: result.user
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

/* ===========================
   LOGIN (email OR username)
=========================== */
exports.login = async (req, res) => {
  try {
    // Expecting: { identifier, password }
    const result = await authService.login({
      identifier: req.body.identifier,
      password: req.body.password
    });

    if (result.error) {
      return res.status(400).json({ error: result.error });
    }

    return res.status(200).json({
      token: result.token,
      user: result.user
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const jwt = require("jsonwebtoken");
const config = require("../config");

function validateToken(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({
      auth: false,
      message: "Not token specified.",
    });
  }
  try {
    const decode = jwt.verify(token, config.secret);
    req.userCedula = decode.cedula;
    next();
  } catch (err) {
    return res.status(401).json(err);
  }
}

module.exports = validateToken;

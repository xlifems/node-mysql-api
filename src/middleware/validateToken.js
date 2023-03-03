import jwt from "jsonwebtoken";
//const config = require("../../config.js");

// Verify a JWT token with a secret key
export const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(401).json({
      auth: false,
      message: "Not token specified.",
    });
  }
  try {
    const secretKey = "mysecretkey";
    const decode = jwt.verify(token, secretKey);
    console.log("🚀 ~ file: users.controller.js:91 ~ login ~ decode:", decode);

    next();
  } catch (err) {
    return res.status(401).json(err);
  }
};

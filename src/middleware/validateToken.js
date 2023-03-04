import jwt from "jsonwebtoken";
import { SECRET } from "../../config.js";

// Verify a JWT token with a secret key
export const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"]; 
  if (!token) {
    return res.status(401).json({
      auth: false,
      message: "Not token specified",
    });
  }
  try {
    const verified = jwt.verify(token, SECRET);
    req.uid = verified.uid
    next();
  } catch (err) {
    return res.status(401).json(err);
  }
};

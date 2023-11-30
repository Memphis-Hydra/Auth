import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const verifyToken = (req, res, next) => {
  const token = req.cookies["accessToken"]; // get cookie if exists

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCES_TOKEN_SECRET);
    req.user = decoded; // You can access user information in the protected routes
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token." });
  }
};

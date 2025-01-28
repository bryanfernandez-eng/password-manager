import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    // Check if token exists and is not expired
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, token is required" });
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Not authorized, token is invalid or expired",
        });
    }

    // Check if token payload contains userId
    if (!decoded.userId) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Not authorized, invalid token payload",
        });
    }

    const user = await User.findById(decoded.userId).select("-password");

    // Check if user exists
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Not authorized, user not found" });
    }

    // Attach user to the request object
    req.user = user;

    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

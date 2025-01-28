import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/utils.js";

// Signup
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // check if user missed inputting a required field
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // check if email is in valid format
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ succes: false, msg: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });

    // check if user already exists
    if (existingUser) {
      return res
        .status(400)
        .json({ succes: false, message: "Email already exists" });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hashedPassword });

    // save user to the database and generate JWT token
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      return res.status(200).json({ succes: true, message: newUser });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in signup controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // check if user missed inputting a required field
    if (!email || !password) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }

    const user = await User.findOne({ email });

    // check if user does not exist
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    // check if password is incorrect
    if (!isMatch) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid Credentials" });
    }

    // generate JWT token
    generateToken(user._id, res);

    return res.status(200).json({ success: true, message: user });
  } catch (error) {
    console.error("Error in login controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    // destroy the JWT cookie when user logs out
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ success: true, message: "Logged out" });
  } catch (error) {
    console.error("Error in login controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Check Authentication
export const checkAuth = async (req, res) => {
  try {
    // check if JWT cookie exists and is valid
    return res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

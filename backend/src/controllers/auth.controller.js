import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../lib/generalToken.js";
import { sendVerifcationEmail } from "../lib/sendEmail.js";
import { generateVerificationCode } from "../lib/generateVerificationCode.js";

let unverifiedUsers = {};

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  const verificationCode = generateVerificationCode();

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
        .json({ success: false, msg: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });

    // check if user already exists
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    unverifiedUsers[email] = {
      email,
      name,
      password: hashedPassword,
      verificationCode,
      createdAt: Date.now(),
    };

    await sendVerifcationEmail(verificationCode, email);

    return res.status(200).json({
      succes: true,
      message: `Verification code send to ${email}. Code experies in 5 minutes.`,
    });
  } catch (error) {
    console.error("Error in signup controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const verifyCode = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const unverifiedUser = unverifiedUsers[email];

    if (
      !unverifiedUser ||
      unverifiedUser.verificationCode !== verificationCode
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification code" });
    }

    const expirationTime = 5 * 60 * 1000;
    if (Date.now() - unverifiedUser.createdAt > expirationTime) {
      delete unverifiedUsers[email]; // Remove expired user data
      return res
        .status(400)
        .json({ success: false, message: "Verification code has expired" });
    }

    const newUser = new User({
      name: unverifiedUser.name,
      email: unverifiedUser.email,
      password: unverifiedUser.password,
    });

    // save user to the database and generate JWT token
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();
      delete unverifiedUsers[email];

      return res.status(200).json({ succes: true, message: newUser });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in verifyCode controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);

  try {
    if (req.cookies.jwt) {
      return res
        .status(200)
        .json({ success: false, message: "Already logged in" });
    }

    // check if user missed inputting a required field
    if (!email || !password) {
      return res.status(400).json({ msg: "Please fill all fields" });
    }
    console.log("-- email", email);
    const user = await User.findOne({ email });
    console.log("-- user", user);
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

// Delete Account
export const deleteAccount = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, user not found" });
    }
    const user = await User.findByIdAndDelete(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.cookie("jwt", "", { maxAge: 0 });

    return res.status(200).json({ success: true, message: "Account deleted" });
  } catch (error) {
    console.error("Error in deleteAccount controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Check authentication
export const checkAuth = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller:", error.message);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// Update account
export const updateAccount = async (req, res) => {
  const { name, password } = req.body;

  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, user not found" });
    }

    if (!name && !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in atleast one field" });
    }

    const updateFields = {};

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(password, salt);
    }

    if (name) {
      updateFields.name = name;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateFields, {
      new: true,
    }).select("-password");

    return res.status(200).json({ success: true, message: user });
  } catch (error) {
    console.error("Error in updateAccount controller: ", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

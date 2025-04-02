import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateVerificationCode } from "../lib/generateVerificationCode.js";
import { sendResetPasswordEmail } from "../lib/sendEmail.js";

// Temporary storage for reset codes
let resetCodes = {};

// Request a password reset
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      // For security reasons, always return success even if the email doesn't exist
      return res.status(200).json({ 
        success: true, 
        message: "If your email exists in our system, you will receive a reset code." 
      });
    }

    // Generate a reset code
    const resetCode = generateVerificationCode();
    
    // Store the reset code with expiration (5 minutes)
    resetCodes[email] = {
      code: resetCode,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      userId: user._id
    };

    // Send reset email
    await sendResetPasswordEmail(resetCode, email);

    return res.status(200).json({
      success: true,
      message: "If your email exists in our system, you will receive a reset code."
    });
  } catch (error) {
    console.error("Error in forgotPassword controller:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Verify the reset code
export const verifyResetCode = async (req, res) => {
  const { email, resetCode } = req.body;

  try {
    if (!email || !resetCode) {
      return res.status(400).json({ success: false, message: "Email and reset code are required" });
    }

    // Check if reset code exists and is valid
    const resetData = resetCodes[email];
    if (!resetData || resetData.code !== resetCode) {
      return res.status(400).json({ success: false, message: "Invalid reset code" });
    }

    // Check if code has expired
    if (Date.now() > resetData.expiresAt) {
      delete resetCodes[email];
      return res.status(400).json({ success: false, message: "Reset code has expired" });
    }

    return res.status(200).json({
      success: true,
      message: "Reset code verified successfully"
    });
  } catch (error) {
    console.error("Error in verifyResetCode controller:", error.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Reset the password
export const resetPassword = async (req, res) => {
  const { email, resetCode, newPassword } = req.body;

  try {
    if (!email || !resetCode || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: "Email, reset code, and new password are required" 
      });
    }

    // Check if reset code exists and is valid
    const resetData = resetCodes[email];
    if (!resetData || resetData.code !== resetCode) {
      return res.status(400).json({ success: false, message: "Invalid reset code" });
    }

    // Check if code has expired
    if (Date.now() > resetData.expiresAt) {
      delete resetCodes[email];
      return res.status(400).json({ success: false, message: "Reset code has expired" });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the user's password
    const user = await User.findByIdAndUpdate(
      resetData.userId,
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    delete resetCodes[email];

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully"
    });
  } catch (error) {
    console.error("Error in resetPassword controller:", error.message);  
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
import { User } from "../models/user.model.js";
import { encrypt, decrypt } from "../lib/encryption.js";

// Adds a new password entry to the user's saved passwords collection
export const addPassword = async (req, res) => {
  const { siteName, siteUrl, email, password } = req.body;

  try {
    // Validate that all required fields are provided
    if (!siteName || !siteUrl || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findById(req.user._id);

    // Check if user exists
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Check if the same email is already saved for this site
    if (
      user.savedPasswords.find(
        (p) => p.email === email && p.siteName === siteName
      )
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Same email for same site" });
    }

    // Encrypt the password before storing it
    const encryptedPassword = encrypt(password);

    // Add the new password to the user's collection
    user.savedPasswords.push({
      siteName,
      siteUrl,
      email,
      password: encryptedPassword,
    });

    await user.save();

    return res
      .status(201)
      .json({ success: true, message: "Password added successfully" });
  } catch (error) {
    console.error("Error in addPassword controller: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Deletes a specific password entry based on site name and email
export const deletePassword = async (req, res) => {
  const { siteName, email } = req.body;

  try {
    // Validate that all required fields are provided
    if (!siteName || !email) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findById(req.user._id);

    // Check if user exists
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Find the index of the password to delete
    const passwordIndex = user.savedPasswords.findIndex(
      (p) => p.email === email && p.siteName === siteName
    );

    // Check if the password exists
    if (passwordIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Password not found" });
    }

    // Remove the password from the array
    user.savedPasswords.splice(passwordIndex, 1);

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password deleted successfully" });
  } catch (error) {
    console.error("Error in deletePassword controller: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Clears all saved passwords for a user
export const deleteAllPasswords = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Check if user exists
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Reset the saved passwords array to empty
    user.savedPasswords = [];

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "All passwords deleted successfully" });
  } catch (error) {
    console.error("Error in deleteAllPasswords controller: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Retrieves a specific password entry and decrypts it
export const getPassword = async (req, res) => {
  const { email, siteName } = req.params;

  try {
    // Validate that all required fields are provided
    if (!siteName || !email) {
      return res.status(400).json({
        success: false,
        message: "Fields are required",
      });
    }
    const user = await User.findById(req.user._id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find the requested password entry
    const passwordEntry = user.savedPasswords.find(
      (p) => email == p.email && siteName === p.siteName
    );

    // Check if the password exists
    if (!passwordEntry) {
      return res.status(404).json({
        success: false,
        message: "Password entry not found",
      });
    }

    // Decrypt the password before sending it back
    const decryptedPassword = decrypt(passwordEntry.password);

    res.status(200).json({
      success: true,
      data: {
        siteName: passwordEntry.siteName,
        siteUrl: passwordEntry.siteUrl,
        email: passwordEntry.email,
        notes: passwordEntry.notes,
        password: decryptedPassword,
        createdAt: passwordEntry.createdAt,
        updatedAt: passwordEntry.updatedAt,
      },
    });
  } catch (error) {
    console.error("Error in getPassword controller: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Not completed - Will handle searching through saved passwords
const searchPasswords = async (req, res) => {
  try {
  } catch (error) {
    console.error("Error in searchPasswords controller: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

// Implementation for editPassword function in password.controller.js

export const editPassword = async (req, res) => {
  try {
    const { oldSiteName, oldEmail, siteName, siteUrl, email, password, notes } =
      req.body;

    // Validate that all required fields are provided
    if (
      !oldSiteName ||
      !oldEmail ||
      !siteName ||
      !siteUrl ||
      !email ||
      !password
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findById(req.user._id);

    // Check if user exists
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Find the index of the password to update
    const passwordIndex = user.savedPasswords.findIndex(
      (p) => p.email === oldEmail && p.siteName === oldSiteName
    );

    // Check if the password exists
    if (passwordIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Password not found" });
    }

    // Encrypt the new password
    const encryptedPassword = encrypt(password);

    // Check if the user is trying to update to a siteName/email combination that already exists
    if (oldSiteName !== siteName || oldEmail !== email) {
      const passwordExists = user.savedPasswords.some(
        (p, index) =>
          index !== passwordIndex &&
          p.email === email &&
          p.siteName === siteName
      );

      if (passwordExists) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "A password entry with this site name and email already exists",
          });
      }
    }

    // Update the password entry
    user.savedPasswords[passwordIndex] = {
      siteName,
      siteUrl,
      email,
      password: encryptedPassword,
      notes: notes || user.savedPasswords[passwordIndex].notes || "",
      createdAt: user.savedPasswords[passwordIndex].createdAt,
      updatedAt: Date.now(),
    };

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in editPassword controller: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getAllPasswords = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Check if user exists
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Map through saved passwords and decrypt each one
    const decryptedPasswords = user.savedPasswords.map((entry) => {
      return {
        siteName: entry.siteName,
        siteUrl: entry.siteUrl,
        email: entry.email,
        notes: entry.notes || "",
        // We don't send the actual password in the initial list for security
        password: "••••••••", // Placeholder for UI
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      };
    });

    res.status(200).json({
      success: true,
      data: decryptedPasswords,
    });
  } catch (error) {
    console.error("Error in getAllPasswords controller: ", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

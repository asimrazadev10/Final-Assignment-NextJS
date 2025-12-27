import User from "../models/User.js";
import regEmailTest from "../utils/regEmailTest.js";
import isAlphabetOnly from "../utils/isAlphabetOnly.js";
import charLength from "../utils/charLength.js";
import sanitizeInput from "../utils/sanitizeInput.js";

import { validationResult } from "express-validator";

const getMe = async (req, res) => {
  const u = await User.findById(req.userId).select("-passwordHash");
  res.json(u);
};

const getUserByUsername = async (req, res) => {
  const u = await User.findOne({ username: req.params.username }).select(
    "-passwordHash"
  );
  if (!u) return res.status(404).json({ message: "Not found" });
  const isMe = u._id.toString() === req.userId;
  u._doc.isMe = isMe;
  res.json({
    user: u,
  });
};

const changePassword = async (req, res) => {
  const resData = {};
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: "Current password and new password are required" });
  }

  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const bcrypt = await import("bcryptjs");
    const isPasswordValid = await bcrypt.default.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Validate new password length
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "New password must be at least 8 characters long" });
    }

    // Hash and update password
    const newPasswordHash = await bcrypt.default.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.userId, { passwordHash: newPasswordHash });

    resData.status = 200;
    resData.message = "Password changed successfully";
    return res.json(resData);
  } catch (e) {
    console.error("Error changing password:", e);
    return res.status(500).json({ message: "Failed to change password" });
  }
};

const updateUser = async (req, res) => {
  const resData = {};
  const data = { ...req.body };

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    resData.message = "Validation failed";
    resData.errors = errors.array();
    return res.json(resData);
  }

  try {
    if (data.email) {
      let email_get = sanitizeInput(data.email);
      if (regEmailTest(email_get) === 0) {
        resData.message = "Email is not valid";
        return res.json(resData);
      }
    }

    if (data.name) {
      let name_get = sanitizeInput(data.name);
      if (isAlphabetOnly(name_get) === 0) {
        resData.message = "Name invalid: Only characters are allowed";
        return res.json(resData);
      } else if (charLength(name_get, 6, 35) === 0) {
        resData.message =
          "Name invalid: Number of characters should be from 6 to 35";
        return res.json(resData);
      }
    }

    if (data.username) {
      let username_get = sanitizeInput(data.username);
      if (charLength(username_get, 6, 35) === 0) {
        resData.message =
          "Username invalid: Number of characters should be from 6 to 35";
        return res.json(resData);
      }

      const usernameCheck = await User.findOne({ username: username_get });
      if (usernameCheck && usernameCheck._id.toString() !== req.userId) {
        resData.message = "Username already exists";
        return res.json(resData);
      }
    }

    // Don't allow password updates through this endpoint (use changePassword instead)
    if (data.password || data.passwordHash) {
      delete data.password;
      delete data.passwordHash;
    }

    const u = await User.findByIdAndUpdate(req.userId, data, {
      new: true,
    }).select("-passwordHash");

    if (u) {
      resData.status = 201;
      resData.message = "User Updated Successfully";
      resData.user = u;
    } else {
      resData.status = 400;
      resData.message = "Error for Updating Data";
    }
    return res.json(resData);
  } catch (e) {
    console.error("Error updating user:", e);
    return res.status(500).json({ message: "Failed to update user" });
  }
};

const searchUsers = async (req, res) => {
  const q = req.query.q.trim();
  let users = await User.find({ $text: { $search: req.query.q } })
    .limit(20)
    .select("username name");

  if (users.length === 0) {
    const regex = new RegExp(q.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "i");
    users = await User.find({ content: regex })
      .limit(20)
      .select("username name email companyName");
  }

  res.json(users);
};

// Admin functions
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash").sort({ createdAt: -1 });
    return res.json({ data: users });
  } catch (e) {
    console.error("Error fetching users:", e);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

const createUser = async (req, res) => {
  const resData = {};
  const data = { ...req.body };

  try {
    // Validation
    if (!data.email || !data.username || !data.name || !data.password) {
      return res.status(400).json({ message: "Email, username, name, and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email: data.email }, { username: data.username }] 
    });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email or username already exists" });
    }

    // Create user (password will be hashed in the model or you can use bcrypt here)
    // For now, assuming password is sent and needs to be hashed
    const bcrypt = await import("bcryptjs");
    const passwordHash = await bcrypt.default.hash(data.password, 10);

    const newUser = await User.create({
      ...data,
      passwordHash,
      role: data.role || "user",
    });

    const user = await User.findById(newUser._id).select("-passwordHash");
    return res.json({
      status: 201,
      message: "User created successfully",
      data: { user },
    });
  } catch (e) {
    console.error("Error creating user:", e);
    return res.status(500).json({ message: "Failed to create user", error: e.message });
  }
};

const updateUserById = async (req, res) => {
  const resData = {};
  const data = { ...req.body };
  const userId = req.params.id;

  try {
    if (data.email) {
      let email_get = sanitizeInput(data.email);
      if (regEmailTest(email_get) === 0) {
        resData.message = "Email is not valid";
        return res.status(400).json(resData);
      }
    }

    if (data.name) {
      let name_get = sanitizeInput(data.name);
      if (isAlphabetOnly(name_get) === 0) {
        resData.message = "Name invalid: Only characters are allowed";
        return res.status(400).json(resData);
      } else if (charLength(name_get, 6, 35) === 0) {
        resData.message = "Name invalid: Number of characters should be from 6 to 35";
        return res.status(400).json(resData);
      }
    }

    if (data.username) {
      let username_get = sanitizeInput(data.username);
      if (charLength(username_get, 6, 35) === 0) {
        resData.message = "Username invalid: Number of characters should be from 6 to 35";
        return res.status(400).json(resData);
      }

      const usernameCheck = await User.findOne({ username: username_get, _id: { $ne: userId } });
      if (usernameCheck) {
        resData.message = "Username already exists";
        return res.status(400).json(resData);
      }
    }

    // Hash password if provided
    if (data.password) {
      const bcrypt = await import("bcryptjs");
      data.passwordHash = await bcrypt.default.hash(data.password, 10);
      delete data.password;
    }

    const u = await User.findByIdAndUpdate(userId, data, {
      new: true,
    }).select("-passwordHash");

    if (u) {
      return res.json({
        status: 200,
        message: "User Updated Successfully",
        data: { user: u },
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (e) {
    console.error("Error updating user:", e);
    return res.status(500).json({ message: "Failed to update user", error: e.message });
  }
};

const deleteUserById = async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json({
      status: 200,
      message: "User deleted successfully",
    });
  } catch (e) {
    console.error("Error deleting user:", e);
    return res.status(500).json({ message: "Failed to delete user", error: e.message });
  }
};

export default {
  getMe,
  getUserByUsername,
  updateUser,
  changePassword,
  searchUsers,
  getAllUsers,
  createUser,
  updateUserById,
  deleteUserById,
};

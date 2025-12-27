import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import { hash } from "bcryptjs";
import connectToMongo from "../db.js";

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await connectToMongo();
    console.log("Connected to MongoDB");

    // Admin user details
    const adminData = {
      username: "admin",
      name: "Admin User",
      email: "admin@example.com",
      password: "admin123", // Change this to a secure password
      role: "admin",
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [{ email: adminData.email }, { username: adminData.username }] 
    });

    if (existingAdmin) {
      console.log("Admin user already exists!");
      if (existingAdmin.role !== "admin") {
        existingAdmin.role = "admin";
        await existingAdmin.save();
        console.log("Updated existing user to admin role");
      }
      process.exit(0);
    }

    // Hash password
    const passwordHash = await hash(adminData.password, 10);

    // Create admin user
    const admin = await User.create({
      username: adminData.username,
      name: adminData.name,
      email: adminData.email,
      passwordHash: passwordHash,
      role: "admin",
    });

    console.log("✅ Admin user created successfully!");
    console.log("Email:", adminData.email);
    console.log("Password:", adminData.password);
    console.log("\n⚠️  Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();


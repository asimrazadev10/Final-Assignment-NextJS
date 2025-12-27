import express from "express";
const router = express.Router();
import { register, login } from "../controllers/authController.js";

import { body } from "express-validator";

router.post(
  "/register",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
    body("username").notEmpty().withMessage("Username is required"),
  ],
  register
);
router.post("/login", login);

export default router;

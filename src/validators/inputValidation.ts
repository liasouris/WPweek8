import { body } from "express-validator";

export const usernameValidator = [
    body("username")
        .trim()
        .escape()
        .isLength({ min: 3, max: 25 })
        .withMessage("Username must be between 3 and 25 characters long"),
];

export const emailValidator = [
    body("email")
        .trim()
        .escape()
        .isEmail()
        .withMessage("Invalid email address"),
];

export const passwordValidator = [
    body("password")
        .trim()
        .escape()
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/\d/)
        .withMessage("Password must contain at least one number")
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage("Password must contain at least one special character (!@#$%^&*)"),
];

export const loginValidator = [
    body("username").trim().escape().notEmpty().withMessage("Username is required"),
    body("password").trim().escape().notEmpty().withMessage("Password is required"),
];

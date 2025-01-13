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
    body()
        .custom((value, { req }) => {
            if (!req.body.email && !req.body.username) {
                throw new Error("Either email or username is required");
            }
            return true;
        })
        .withMessage("Either email or username is required"),
    body("email")
        .optional()
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Invalid email address"),
    body("username")
        .optional()
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Invalid username"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required"),
];


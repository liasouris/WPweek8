"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.passwordValidator = exports.emailValidator = exports.usernameValidator = void 0;
const express_validator_1 = require("express-validator");
exports.usernameValidator = [
    (0, express_validator_1.body)("username")
        .trim()
        .escape()
        .isLength({ min: 3, max: 25 })
        .withMessage("Username must be between 3 and 25 characters long"),
];
exports.emailValidator = [
    (0, express_validator_1.body)("email")
        .trim()
        .escape()
        .isEmail()
        .withMessage("Invalid email address"),
];
exports.passwordValidator = [
    (0, express_validator_1.body)("password")
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
exports.loginValidator = [
    (0, express_validator_1.body)()
        .custom((value, { req }) => {
        if (!req.body.email && !req.body.username) {
            throw new Error("Either email or username is required");
        }
        return true;
    })
        .withMessage("Either email or username is required"),
    (0, express_validator_1.body)("email")
        .optional()
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Invalid email address"),
    (0, express_validator_1.body)("username")
        .optional()
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Invalid username"),
    (0, express_validator_1.body)("password")
        .trim()
        .notEmpty()
        .withMessage("Password is required"),
];

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const inputValidation_1 = require("../validators/inputValidation");
const validateToken_1 = require("../middleware/validateToken");
const Topic_1 = require("../models/Topic");
const User_1 = require("../models/User");
const router = (0, express_1.Router)();
router.post("/api/user/register", [...inputValidation_1.usernameValidator, ...inputValidation_1.emailValidator, ...inputValidation_1.passwordValidator], async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const existingUser = await User_1.User.findOne({ email: req.body.email });
        if (existingUser) {
            res.status(403).json({ error: "Email already in use" });
            return;
        }
        const salt = bcrypt_1.default.genSaltSync(10);
        const hash = bcrypt_1.default.hashSync(req.body.password, salt);
        const newUser = await User_1.User.create({
            email: req.body.email,
            username: req.body.username,
            password: hash,
            isAdmin: req.body.isAdmin || false,
        });
        res.status(200).json(newUser);
    }
    catch (error) {
        console.error(`Error during registration: ${error.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
router.post("/api/user/login", inputValidation_1.loginValidator, async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
    }
    try {
        const user = await User_1.User.findOne({
            $or: [{ username: req.body.username }, { email: req.body.email }],
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const isPasswordValid = bcrypt_1.default.compareSync(req.body.password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const jwtPayload = {
            id: user._id,
            username: user.username,
            isAdmin: user.isAdmin,
        };
        const token = jsonwebtoken_1.default.sign(jwtPayload, process.env.SECRET, { expiresIn: "2m" });
        res.status(200).json({ success: true, token });
    }
    catch (error) {
        console.error(`Error during user login: ${error.message}`);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// Get All Topics Route
router.get("/api/topics", async (req, res) => {
    try {
        const topics = await Topic_1.Topic.find();
        res.status(200).json(topics);
    }
    catch (error) {
        console.error(`Error fetching topics: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
router.post("/api/topic", validateToken_1.validateToken, async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized access." });
            return;
        }
        const newTopic = await Topic_1.Topic.create({
            title,
            content,
            username: req.user.username,
            createdAt: new Date(),
        });
        res.status(201).json(newTopic);
    }
    catch (error) {
        console.error(`Error creating topic: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
router.delete("/api/topic/:id", validateToken_1.validateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const topic = await Topic_1.Topic.findByIdAndDelete(id);
        if (!topic) {
            res.status(404).json({ message: "Topic not found." });
            return;
        }
        res.status(200).json({ message: "Topic deleted successfully." });
    }
    catch (error) {
        console.error(`Error deleting topic: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.default = router;

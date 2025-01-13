"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAdmin = exports.validateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validateToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Token not found." });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        req.user = decoded;
        next();
    }
    catch (err) {
        res.status(401).json({ message: "Invalid token." });
    }
};
exports.validateToken = validateToken;
const validateAdmin = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Token not found." });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        req.user = decoded;
        if (!decoded.isAdmin) {
            res.status(403).json({ message: "Access denied." });
            return;
        }
        next();
    }
    catch (err) {
        res.status(401).json({ message: "Invalid token." });
    }
};
exports.validateAdmin = validateAdmin;

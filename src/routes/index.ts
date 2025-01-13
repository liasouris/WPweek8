import { Router, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { usernameValidator, emailValidator, passwordValidator, loginValidator } from "../validators/inputValidation";
import { validateToken, validateAdmin } from "../middleware/validateToken";

import { Topic, ITopic } from "../models/Topic";
import { User, IUser } from "../models/User";

const router: Router = Router();

router.post(
    "/api/user/register",
    [...usernameValidator, ...emailValidator, ...passwordValidator],
    async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        try {
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                res.status(403).json({ error: "Email already in use" });
                return;
            }

            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(req.body.password, salt);

            const newUser = await User.create({
                email: req.body.email,
                username: req.body.username,
                password: hash,
                isAdmin: req.body.isAdmin || false,
            });

            res.status(200).json(newUser);
        } catch (error: any) {
            console.error(`Error during registration: ${error.message}`);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

router.post(
    "/api/user/login",
    loginValidator,
    async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        try {
            const user: IUser | null = await User.findOne({
                $or: [{ username: req.body.username }, { email: req.body.email }],
            });
            if (!user) {
                res.status(404).json({ message: "User not found" });
                return;
            }
            

            const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({ message: "Invalid credentials" });
                return;
            }

            const jwtPayload: JwtPayload = {
                id: user._id,
                username: user.username,
                isAdmin: user.isAdmin,
            };

            const token: string = jwt.sign(jwtPayload, process.env.SECRET as string, { expiresIn: "2m" });

            res.status(200).json({ success: true, token });
        } catch (error: any) {
            console.error(`Error during user login: ${error.message}`);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
);

router.get("/api/topics", async (req: Request, res: Response): Promise<void> => {
    try {
        const topics = await Topic.find();
        res.status(200).json(topics);
    } catch (error: any) {
        console.error(`Error fetching topics: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post("/api/topic", validateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, content } = req.body;

        if (!req.user) {
            res.status(401).json({ message: "Unauthorized access." });
            return;
        }

        const newTopic = await Topic.create({
            title,
            content,
            username: req.user.username,
            createdAt: new Date(),
        });

        res.status(200).json(newTopic);
    } catch (error: any) {
        console.error(`Error creating topic: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.delete("/api/topic/:id", validateAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const topic = await Topic.findByIdAndDelete(id);
        if (!topic) {
            res.status(404).json({ message: "Topic not found." });
            return;
        }

        res.status(200).json({ message: "Topic deleted successfully." });
    } catch (error: any) {
        console.error(`Error deleting topic: ${error.message}`);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;

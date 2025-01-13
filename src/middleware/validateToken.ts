import {Request, Response, NextFunction} from "express"
import jwt, {JwtPayload} from "jsonwebtoken"

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
        }
    }
}

export const validateToken = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers["authorization"]?.split(" ")[1]; 
    if (!token) {
        res.status(401).json({ message: "Token not found." });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET as string) as JwtPayload;
        req.user = decoded; 
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token." });
    }
};

export const validateAdmin = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Token not found." });
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET as string) as JwtPayload;
        req.user = decoded;

        if (!decoded.isAdmin) {
            res.status(403).json({ message: "Access denied." });
            return;
        }

        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token." });
    }
};

import jwt, { type JwtPayload } from 'jsonwebtoken';
import { type NextFunction, type Request, type Response } from "express"
import type { IUser } from "../model/User.js"

export interface AuthencaticatedRequest extends Request {
    user?: IUser | null;
}

export const isAuth = async(req: AuthencaticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            res.status(401).json({
                message: "Please login - no auth header"
            })
            return;
        }

        const token = authHeader.split(" ")[1] as string;

        const decodedValue = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload

        if(!decodedValue || !decodedValue.user) {
            res.status(401).json({
                message: "Invalid token"
            })
            return;
        }

        req.user = decodedValue.user;
        next();

    } catch (error) {
        res.status(401).json({
            message: "Please login - JWT error"
        })
    }
}
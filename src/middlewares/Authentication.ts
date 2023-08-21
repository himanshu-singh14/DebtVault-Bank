import { Request, Response, NextFunction } from "express";
import Authentication from "../utils/Authentication";
const COOKIE_NAME_KEY = "token";

const authenticated = (req: Request, res: Response, next: NextFunction) => {
        const token = req.cookies[COOKIE_NAME_KEY];
        if (!token) {
            return res.status(401).send("Authentication credentials not provided!.. Login Required!");
        }

        try {
            Authentication.validateToken(token);
            next();
        } catch ( error ) {
            return res.status(401).send("Token Expired!.. Login Required!");
        }
    };

export default authenticated;
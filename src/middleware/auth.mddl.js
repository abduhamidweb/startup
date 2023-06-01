import {
    JWT
} from "../utils/jwt.js";
export default async function authMiddleware(req, res, next) {
    const token = req.headers.token;
    if (!token) {
        return res.status(401).json({
            error: 'Token not found'
        });
    }
    try {
        const decodedToken = JWT.VERIFY(token).id;
        if (!decodedToken) throw new Error(`Invalid token. Expected ${decodedToken}`);
        else return next();

    } catch (error) {
        return res.status(401).json({
            error: 'Invalid token'
        });
    }
};
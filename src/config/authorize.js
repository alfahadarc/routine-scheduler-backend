import dotenv from 'dotenv'
dotenv.config()
import jwt from "jsonwebtoken"

const secret = process.env.SECRET;

export function verifyToken(req, res, next) {
    const token =
        req.body.token || req.query.token || req.headers["x-access-token"] || req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) {
        return res
            .status(401)
            .json({message: "A token is required for authentication"});
    }
    try {
        const decoded = jwt.verify(token, secret);
        req.user = decoded;
    } catch (err) {
        return res.status(401).json(new Error("Invalid token"));
    }
    return next();
};

export function authorize()  {
    return (req, res, next) => {
        const token =
            req.body.token || req.query.token || req.headers["x-access-token"] || req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

        if (!token) {
            return res.status(401).json({message:"You must log in"});
        }
        try {
            const decoded = jwt.verify(token, secret);
            req.username = decoded.username;
            next();

        } catch (err) {
            return res.status(401).json(new Error("Invalid Token"));
        }
    };
};

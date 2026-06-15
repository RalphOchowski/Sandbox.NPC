import jwt from "jsonwebtoken"; //take note
import { JWT_SECRET } from "./config.js";

export const generateToken = (userId, res) => {
    const token = jwt.sign({
        userId
    }, process.env.JWT_SECRET, {
        expiresIn: "7d"
    }); //take note

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, //prevents XSS attacks... aka cross-side scripting...?
        sameSite: "strict", //prevents CSRF attacks...?
        secure: process.env.NODE_ENV === "development" ? false : true
    }); //take note

    return token;
};

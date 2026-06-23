import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../lib/config.js";

export const protectRoute = async (req, res, next) => { //take note, last parameter representing the adjacent function that is supposed to be called once the validation is successful
    try {
        const token = req.cookies.jwt; //whether the user has a token
        if (!token)
            return res.status(401).json({
                message: "Unauthorized Access - No Token Provided."
            });

        const decoded = jwt.verify(token, JWT_SECRET); //whether the token is valid
        if (!decoded)
            return res.status(401).json({
                message: "Unauthorized Access - Invalid Token Provided."
            });

        const user = await User.findById(decoded.userId).select("-password"); //whether the user exists in the database
        if (!user)
            return res.status(404).json({
                message: "User not found."
            });

        req.user = user; //take note
        next(); //calls adjacent function, this function gets access to the user object above apparently, idk how
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error);
        res.status(500).json({
            message: "Internal server error."
        });
    }
}

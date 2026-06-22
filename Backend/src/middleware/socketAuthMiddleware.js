import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { JWT_SECRET } from "../lib/config.js";

export const socketAuthMiddleware = async (socket, next) => {
    try {
        //step 1: extract the token from the http-only cookie
        const token = socket.handshake.headers.cookie
            ?.split("; ")
            .find((row) => row.startsWith("jwt="))
            ?.split("=")[1]; // take note... what the fuck?

        if (!token) {
            console.log("Socket connection rejected: token not provided");
            return next(new Error("Unauthorized - No Token Provided"));
        }

        //step 2: verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            console.log("Socket connection rejected: token not valid");
            return next(new Error("Unauthorized - Invalid Token"));
        }

        //step 3: find the user in db
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            console.log("Socket connection rejected: User not found");
            return next(new Error("User Not Found"));
        }

        //step 4: attach user info to socket
        socket.user = user;
        socket.userId = user._id.toString();
        console.log(`Socket authenticated for user: ${user.fullName} (${user._id})`);

        //step 5: call the next method
        next();
    }
    catch (error) {
        console.log("Error in socket authentication: ", error.message);
        return next(new Error("Unauthorized - Authentication Failed"));
    }
};
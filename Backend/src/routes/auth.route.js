import express from "express";

import { signup, login, logout, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

const router = express.Router();
router.use(arcjetProtection); //take note, how does it work?

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile); //added the first middleware function in the middle that can now be used to authenticate the user in order to call the adjacent controller function. Broad definition for middleware being any function that is ran before sending a response back to the client
router.get("/auth-check", protectRoute, (req, res) => res.status(200).json(req.user));//take note, used to check if the user is authenticated and logged in incase they hit refresh

export default router;

import express from "express";
import { getAllContacts, getMessagesByUserId, sendMessage, getChatPartners } from "../controllers/message.controller.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(arcjetProtection, protectRoute); //the middleware specified runs in order of left to right

router.get("/contacts", getAllContacts); //take note, why are we fetching them all
router.get("/chats", getChatPartners); //take note
router.get("/:id", getMessagesByUserId); //take note
router.post("/send/:id", sendMessage);

export default router;

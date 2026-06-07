import express from "express";

const router = express.Router();

router.get("/mesage", (req, res) => {
    res.send("Mesage Checkpoint.");
});

export default router;

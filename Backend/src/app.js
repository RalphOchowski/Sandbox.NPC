//import dns from "node:dns/promises";

import express from "express";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const _dirname = path.resolve();
const port = process.env.PORT || 3000;

app.use(express.json()); // middlewhere that accepts json values from form submisions, stored inside req.body, take note anyways
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

//deployment prep
if(process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(_dirname, "../Frontend/dist/")));
	app.get(/.*/, (req, res) => {
		res.sendFile(path.join(_dirname, "../Frontend/dist/index.html"))
	});
}

app.listen(port, () => {
    console.log(`I guess we're running at localhost:${port}...`);
	connectDB();
});

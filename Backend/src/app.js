//import dns from "node:dns/promises";

import express from "express";
import cookieParser from "cookie-parser";
import path from "path";

import { NODE_ENV, PORT } from "./lib/config.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";



const app = express();
const _dirname = path.resolve();
const port = PORT || 3000;

app.use(express.json()); // middlewhere that accepts json values from form submisions, stored inside req.body, take note anyways
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

//deployment prep
if(NODE_ENV === "production") {
	app.use(express.static(path.join(_dirname, "../Frontend/dist/")));
	app.get(/.*/, (req, res) => {
		res.sendFile(path.join(_dirname, "../Frontend/dist/index.html"))
	});
}

app.listen(port, () => {
    console.log(`I guess we're running at localhost:${port}...`);
	connectDB();
});

//import dns from "node:dns/promises";

import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors"; //take note wtf is this?

import { NODE_ENV, PORT, CLIENT_URL } from "./lib/config.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

const _dirname = path.resolve();
const port = PORT || 3000;

app.use(express.json({ limit: "10mb" })); // middlewhere that accepts json values from form submisions, stored inside req.body, take note anyways
app.use(cors( { origin: CLIENT_URL, credentials: true } )); //take note
app.use(cookieParser()); // take note on what it does
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

//deployment prep
if(NODE_ENV === "production") {
	app.use(express.static(path.join(_dirname, "../Frontend/dist/")));
	app.get(/.*/, (req, res) => {
		res.sendFile(path.join(_dirname, "../Frontend/dist/index.html"))
	});
}

server.listen(port, () => {
    console.log(`I guess we're running at localhost:${port}...`);
	connectDB();
});

//it seems like the express app is handling the routes while the socket handles realtime communication

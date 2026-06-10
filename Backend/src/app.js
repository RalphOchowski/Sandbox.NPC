import express from "express";
import dotenv from "dotenv";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

dotenv.config();

const app = express();
const _dirname = path.resolve();
const port = process.env.PORT || 3000;

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
});

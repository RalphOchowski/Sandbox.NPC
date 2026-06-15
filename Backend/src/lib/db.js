import mongoose from "mongoose";

export const connectDB = async() => {
    try {
        const connectionValue = await mongoose.connect(process.env.MONGO_URI, {
            dbName: "realtime_chat_application"
        }); //take note
        console.log("MongoDB connected successfully: ", connectionValue.connection.host);
    } catch (error) {
        console.error("Error connecting to MongoDB: ", error);
        process.exit(1); //Status code 1 indicates failure, 0 indicates success
    }
};

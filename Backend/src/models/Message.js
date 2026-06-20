import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text: {
        type: String,
        maxLength: 2000
    },
    image: {
        type: String
    },
}, {
    timestamps: true
});

const Message = new mongoose.model("Message", messageSchema);
export default Message;

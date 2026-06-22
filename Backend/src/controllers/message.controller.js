import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, getReceiverSocketId} from "../lib/socket.js";

export const getAllContacts = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({
            _id: {
                $ne: loggedInUserId
            }
        }).select("-password"); //take note
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error while fetching all contacts: ", error);
        res.status(500).json({
            message: "Internal server error."
        });
    }
};

export const getMessagesByUserId = async (req, res) => {
    try {
        const myId = req.user._id;
        const { id: userToChatId } = req.params; //take note

        const message = await Message.find({
            $or: [{
                senderId: myId,
                receiverId: userToChatId
            }, {
                senderId: userToChatId,
                receiverId: myId
            }
            ]
        }); //take note, wtf just happened here? Apparently it finds messages you've sent (first case) and received (second case).
        res.status(200).json(message);
    } catch (error) {
        console.log("Error while fetching messages: ", error);
        res.status(500).json({
            message: "Internal server error."
        });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        //take note, checks if user is not able to send an empty message, a message to themselves, and to a receiver that does not exist
        if (!text && !image) {
            return res.status(400).json({
                message: "Text or image is required."
            });
        }
        if (senderId.equals(receiverId)) {
            return res.status(400).json({
                message: "Cannot send messages to yourself."
            });
        }
        const receiverExists = await User.exists({
            _id: receiverId
        });
        if (!receiverExists) {
            return res.status(404).json({
                message: "Receiver not found."
            });
        }

        let imageUrl; //take note
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image); //upload base 64 image to cloudinary if the user sends an image
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });
        await newMessage.save();

        //take note, this is where we emit the message to the receiver if they are online
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage); // take note, what does newMessage do? It is the event name that the receiver will listen for in order to receive the message. The newMessage object is the data being sent with the event, which contains the details of the message that was just sent.
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error while sending message: ", error.message);
        res.status(500).json({
            message: "Internal server error."
        });
    }
};

export const getChatPartners = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        const messages = await Message.find({
            $or: [{
                senderId: loggedInUserId,
            }, {
                receiverId: loggedInUserId
            }
            ]
        }); //take note, finds all messages where the logged in user was either the sender or the recipient
        const chatPartnerIds = [...new Set(messages.map(msg => msg.senderId.toString() === loggedInUserId.toString() ? msg.receiverId.toString() : msg.senderId.toString()))]; //take note, basically fetches the appropriate id of the other person if the message was either sent or received by the logged in user. Still unclear on the "..." (apparently that "stretches" it, no idea what that means) array, set (to prevent duplication somehow...?) and the map functionality

        const chatPartners = await User.find({
            _id: {
                $in: chatPartnerIds
            }
        }).select("-password"); //take note, that $in popped another blue-screen in my brain

        res.status(200).json(chatPartners);
    } catch (error) {
        console.log("Error while fetching chat partners: ", error.message);
        res.status(500).json({
            message: "Internal server error."
        });
    }
};

import { Server } from "socket.io";
import http from "http";
import express from "express";
import { CLIENT_URL } from "./config.js";
import { socketAuthMiddleware } from "../middleware/socketAuthMiddleware.js";

const app = express();
const server = http.createServer(app); //take note


const io = new Server(server, {
    cors: {
        origin: [CLIENT_URL],
        credentials: true
    },
}); //take note

// apply middleware authentication to all socket connections
io.use(socketAuthMiddleware);

// function to check if the user is online
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

//take note, this is for storing online members
const userSocketMap = {};

// take note of this whole block statement
io.on("connection", (socket) => {
    console.log("A user connected: ", socket.user.fullName);

    const userId = socket.userId;
    userSocketMap[userId] = socket.id;

    //io.emit() is used to send events to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));


    //with socket.on, we can listen for events from clients
    socket.on("disconnect", () => {
        console.log("A user disconnected: ", socket.user.fullName);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap)); //Hey! We lost one!
    });
});

export { io, app, server };

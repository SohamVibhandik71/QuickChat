import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
export const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// Store online users
export const userSocketMap = {};

// Socket.IO connection event
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    console.log("SOCKET CONNECTED");
    console.log("USER ID:", userId);
    console.log("SOCKET ID:", socket.id);

    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    console.log("ONLINE USERS:", userSocketMap);

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        console.log("SOCKET DISCONNECTED:", userId);

        delete userSocketMap[userId];

        console.log("ONLINE USERS:", userSocketMap);

        io.emit(
            "getOnlineUsers",
            Object.keys(userSocketMap)
        );
    });
});

// Middleware
app.use(express.json({ limit: "4mb" }));

app.use(cors());

// Status route
app.use("/api/status", (req, res) => {
    res.send("Server is Live!");
});

// Routes
app.use("/api/auth", userRouter);

app.use("/api/messages", messageRouter);

// Connect database
await connectDB();

const PORT = process.env.PORT || 5000;

// Local development only
if (process.env.NODE_ENV !== "production") {
    server.listen(PORT, () => {
        console.log(`Server is Running on Port ${PORT}`);
    });
}

export default server;
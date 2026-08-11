import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

// Socket.IO
export const io = new Server(server, {
    cors: {
        origin: "*"
    }
});

// Online users
export const userSocketMap = {};

io.on("connection", (socket) => {

    const userId = socket.handshake.query.userId;

    console.log("User connected:", userId);

    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    io.emit(
        "getOnlineUsers",
        Object.keys(userSocketMap)
    );

    socket.on("disconnect", () => {

        console.log("User disconnected:", userId);

        if (userId) {
            delete userSocketMap[userId];
        }

        io.emit(
            "getOnlineUsers",
            Object.keys(userSocketMap)
        );
    });
});

// Middleware
app.use(express.json({ limit: "4mb" }));

app.use(cors());

// Status
app.use("/api/status", (req, res) => {
    res.send("Server is Live!");
});

// Routes
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Database
await connectDB();

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is Running on Port ${PORT}`);
});
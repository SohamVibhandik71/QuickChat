import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from 'socket.io'


//create express app and http server
const app = express();
const server = http.createServer(app);

//Initialize Socket.io server
export const io = new Server(server, {
    cors : {origin: "*"}
})

//store Online users 
export const userSocketMap = {} // {userId : socketId}

//Socket.io connection event
io.on("connection", (socket) => {

    const userId = socket.handshake.query.userId;

    console.log("user connected.", userId);

    if(userId) userSocketMap[userId] = socket.id;

    //Emit online users to all connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log("User Disconnected", userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap))
    })
    
})


//middleware setup
app.use(express.json({"limit" : "4mb"}));
app.use(cors());

app.use("/api/status", (req,res) => (
    res.send("Server is Live!")
))

//userRouter is mounted as middleware on /api/auth.
app.use("/api/auth", userRouter)

//messageRouter is mounted as middleware on /api/messages.
app.use("/api/messages", messageRouter);

//connect Database
await connectDB();

const PORT = process.env.PORT || 5000;

if(process.env.NODE_ENV !== "production"){
    server.listen(PORT,()=>{
        console.log(`Server is Running on Port ${PORT}`)
    });
}
//export server for vercel
export default server;

import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import { connectDB } from "./config/db";
import Routes from "./routes";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api", Routes);

// Socket Setup
const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
app.set("io", io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join_project", (projectId: string) => {
    socket.join(projectId);
    console.log(`Joined project room: ${projectId}`);
  });

  socket.on("create_task", (task) => {
    io.to(task.projectId).emit("task_created", task);
    io.to(task.projectId).emit("notify", `New task: ${task.title}`);
  });

  socket.on("update_task", (task) => {
    io.to(task.projectId).emit("task_updated", task);
    io.to(task.projectId).emit("notify", `Task updated: ${task.title}`);
  });

  socket.on("comment_added", (task) => {
    io.to(task.projectId).emit("notify", `New comment on task: ${task.title}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
server.listen(5000, () => console.log("Server running on port 5000"));

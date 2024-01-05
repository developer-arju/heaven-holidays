import express from "express";
import dotenv from "dotenv";
import { createServer } from "http";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import providerRoutes from "./routes/providerRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { onGetMessage, sendReply } from "./utils/socket.js";
const port = process.env.PORT || 4000;

connectDB();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

const app = express();
const server = createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
export const connectedSockets = {};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("server/public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/provider", providerRoutes);
app.use("/api/admin", adminRoutes);
app.use(notFound);
app.use(errorHandler);

io.on("connection", (socket) => {
  // on new user socket connection send status is online
  socket.on("connect-socket", (data) => {
    connectedSockets[socket.id] = data;
    if (connectedSockets.hasOwnProperty("admin")) {
      io.to(connectedSockets?.admin).emit("online-users", connectedSockets);
    }
  });

  socket.on("admin-connect", (data) => {
    if (data) {
      connectedSockets["admin"] = socket.id;
      io.emit("curr-status", true);
    }
  });

  socket.on("reply-message", async (data) => {
    const chat = await sendReply(data);
    if (chat instanceof Error === false) {
      socket.emit("reply-response", chat);
      for (const socketId in connectedSockets) {
        if (connectedSockets[socketId] === data.clientId) {
          io.to(socketId).emit("from-admin", chat);
        }
      }
    }
  });

  socket.on("check-status", (role) => {
    if (role !== "admin") {
      const adminOnline = connectedSockets.hasOwnProperty("admin");
      socket.emit("curr-status", adminOnline);
    } else {
      socket.emit("online-users", connectedSockets);
    }
  });

  socket.on("clientMessage", async (value) => {
    const chat = await onGetMessage(value);
    if (chat instanceof Error) {
      socket.emit("errorResponse", chat.message);
    } else {
      for (const socketId in connectedSockets) {
        if (connectedSockets[socketId] == chat.clientId.toString()) {
          io.to(socketId).emit("clientResponse", chat);
        }
      }
      io.to(connectedSockets?.admin).emit("send-message", chat);
    }
  });
  socket.on("disconnect", () => {
    if (socket.id === connectedSockets.admin) {
      delete connectedSockets.admin;
      io.emit("curr-status", false);
    } else {
      delete connectedSockets[socket.id];
      io.to(connectedSockets?.admin).emit("online-users", connectedSockets);
    }
  });
});

server.listen(port, () => console.log(`🚀 starts at http://localhost:${port}`));

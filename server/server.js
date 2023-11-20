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
import { onDisconnect } from "./utils/socket.js";
const port = process.env.PORT || 4000;

connectDB();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

const app = express();
const server = createServer(app);
const io = new Server({
  cors: {
    origin: "http://localhost:3000",
  },
});

io.listen(server);
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
  console.log("socket connected: " + socket.id);
  socket.on("disconnect", () => onDisconnect(socket));
});

server.listen(port, () => console.log(`🚀 starts at http://localhost:${port}`));

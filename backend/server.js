const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./db/connectDB");
const pgRoomRoutes = require("./routes/PgRoomRoutes");
const userRoleRoutes = require("./routes/userRoleRouter");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const commentRoutes = require("./routes/commentRoutes");
// const chatbotRoutes = require("./routes/chatbotRoutes");
const { initSocket } = require("./controllers/commentController");
const chatRoute = require("./routes/chatRoute");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// http://localhost:5173
// https://paying-guest-application.onrender.com
// https://pgfinder-wheat.vercel.app
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);

app.use("/api/pg", pgRoomRoutes);
app.use("/api/userrole", userRoleRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/pay", paymentRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/bot", chatRoute);
// app.use("/api/chat", chatbotRoutes);

initSocket(io);

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

connectDB();

server.listen(PORT, () => {
  console.log(`Server is running on PORT 5000`);
});
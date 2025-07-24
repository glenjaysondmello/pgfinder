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
const { initSocket } = require("./controllers/commentController");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST", "PATCH", "DELETE"] },
});

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
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

initSocket(io);
io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on PORT 5000`);
});

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connectDB");
const pgRoomRoutes = require("./routes/PgRoomRoutes");
const userRoleRoutes = require("./routes/userRoleRouter");
const cartRoutes = require("./routes/cartRoutes");

const app = express();
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

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on PORT 5000`);
});

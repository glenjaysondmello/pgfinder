const express = require("express");
const cors = require("cors");
const connectDB = require("./db/connectDB");
const pgRoomRoutes = require("./routes/PgRoomRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/pg", pgRoomRoutes);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on PORT 5000`);
});

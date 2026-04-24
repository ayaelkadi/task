const express = require("express");
const cors = require("cors");

const app = express();
const authRoutes = require("./routes/authRoutes");

const taskRoutes = require("./routes/taskRoutes");

app.use(cors());
app.use(express.json())
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
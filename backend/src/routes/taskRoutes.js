const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  deleteTask,
} = require("../controllers/taskController");
const { updateTask } = require("../controllers/taskController");


const protect = require("../middlewares/authMiddleware");

router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.delete("/:id", protect, deleteTask);
router.put("/:id", protect, updateTask);

module.exports = router;
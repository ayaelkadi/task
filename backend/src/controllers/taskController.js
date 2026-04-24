const Task = require("../models/Task");

// إنشاء مهمة
const taskService = require("../services/taskService");

exports.createTask = async (req, res) => {
  try {
    const { title } = req.body;

    // 🔥 Validation
    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const task = await taskService.createTask(req.body, req.user);

    res.status(201).json({
      success: true,
      data: task,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// جلب المهام
exports.getTasks = async (req, res) => {
  try {
    const result = await taskService.getTasks(req.user, req.query);

    res.json({
      success: true,
      page: result.page,
      totalPages: result.totalPages,
      data: result.tasks,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// حذف مهمة
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // تحقق هل المهمة موجودة
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // 🔥 تحقق هل صاحب المهمة هو نفس المستخدم
    if (task.user.toString() !== req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await task.deleteOne();

    res.json({
  success: true,
  message: "Task deleted",
});
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
exports.updateTask = async (req, res) => {
  try {
    const { title } = req.body;

    // 🔥 Validation (اختياري لكن احترافي)
    if (title !== undefined && title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Title cannot be empty",
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.user.toString() !== req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    task.title = title || task.title;
    task.completed = req.body.completed ?? task.completed;

    const updatedTask = await task.save();

    res.json({
      success: true,
      data: updatedTask,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

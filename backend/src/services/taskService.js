const Task = require("../models/Task");

// إنشاء مهمة
const createTask = async (data, userId) => {
  return await Task.create({
    title: data.title,
    user: userId,
  });
};

// جلب المهام
const getTasks = async (userId, query) => {
  const keyword = query.search
    ? {
        title: {
          $regex: query.search,
          $options: "i",
        },
      }
    : {};

  const statusFilter =
    query.completed !== undefined
      ? { completed: query.completed === "true" }
      : {};

  // 🔥 هنا تكتب sort
  const sortBy = query.sort === "old" ? 1 : -1;

  const page = parseInt(query.page) || 1;
  const limit = 100;
  const skip = (page - 1) * limit;

  const tasks = await Task.find({
    user: userId,
    ...keyword,
    ...statusFilter,
  })
    .sort({ createdAt: sortBy }) // 🔥 هنا يتم استعماله
    .skip(skip)
    .limit(limit);

  const total = await Task.countDocuments({
    user: userId,
    ...keyword,
    ...statusFilter,
  });

  return {
    tasks,
    page,
    totalPages: Math.ceil(total / limit),
  };
};
module.exports = {
  createTask,
  getTasks,
};
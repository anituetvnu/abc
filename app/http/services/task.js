const { transaction } = require('objection');

const { Task, User } = require('../../models');
const { abort } = require('../../helpers/error');
const taskStatus = require('../../enums/taskStatus');

exports.addTask = async ({ userId, title }) => {
  try {
    await transaction(Task, User, async (TaskTrx, UserTrx) => {
      await TaskTrx.query().insert({
        user_id: userId,
        title,
        status: taskStatus.TODO,
      });

      await UserTrx
        .query()
        .findById(userId)
        .increment('task_count', 1);
    });
  } catch (err) {
    return abort(502, "Can't add task");
  }

  return '';
};

exports.getTasks = async ({
  userId, taskCount, offset, limit,
}) => {
  try {
    const tasks = await Task
      .query()
      .select('id', 'title', 'status', 'updated_at')
      .where({ user_id: userId })
      .orderBy('updated_at', 'desc')
      .offset(offset)
      .limit(limit);

    return { results: tasks, total: taskCount };
  } catch (err) {
    return abort(500, "Can't get tasks");
  }
};

exports.updateTask = async ({
  userId, taskId, title, status,
}) => {
  const task = await Task.query().findById(taskId);

  if (!task) return abort(404, 'Task does not exist');
  if (task.user_id !== userId) return abort(403, 'Access denied');

  try {
    await task
      .$query()
      .update({
        title,
        status,
      });
  } catch (err) {
    return abort(500, 'Failed to update task');
  }

  return '';
};

exports.removeTask = async ({ userId, taskId }) => {
  const task = await Task.query().findOne({ id: taskId });

  if (!task) return abort(404, 'Task does not exist');
  if (task.user_id !== userId) return abort(403, 'Access denied');

  try {
    await transaction(Task, User, async (TaskTrx, UserTrx) => {
      await TaskTrx.query().deleteById(taskId);

      await UserTrx
        .query()
        .findById(userId)
        .decrement('task_count', 1);
    });
  } catch (err) {
    return abort(500, 'Failed to delete task');
  }

  return '';
};

exports.getTask = async ({ userId, taskId }) => {
  const task = await Task
    .query()
    .select('id', 'title', 'status', 'user_id')
    .findById(taskId);

  if (!task) return abort(404, 'Task does not exist');
  if (task.user_id !== userId) return abort(403, 'Access denied');

  return task;
};

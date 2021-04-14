const Joi = require('joi');

const taskServices = require('../../services/task');
const { abort } = require('../../../helpers/error');
const taskStatus = require('../../../enums/taskStatus');

const validate = async (params) => {
  const schema = Joi.object({
    taskId: Joi.number().positive().required(),
    title: Joi.string().max(127),
    status: Joi.number().valid(taskStatus.getValues()),
  });
  try {
    return await schema.validate(params);
  } catch (err) {
    return abort(400, 'Params error!');
  }
};

const updateTask = async (req, res) => {
  const userId = req.user.id;
  const { taskId } = req.params;
  const { title, status } = req.body;
  await validate({ taskId, title, status });
  await taskServices.updateTask({
    userId, taskId, title, status,
  });
  res.status(204).send();
};

module.exports = updateTask;

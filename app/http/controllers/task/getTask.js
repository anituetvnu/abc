const Joi = require('joi');

const taskServices = require('../../services/task');
const { abort } = require('../../../helpers/error');

const validate = async (params) => {
  const schema = Joi.object({
    taskId: Joi.number().positive().required(),
  });
  try {
    return await schema.validate(params);
  } catch (err) {
    return abort(400, 'Params error!');
  }
};

const getTask = async (req, res) => {
  const userId = req.user.id;
  const { taskId } = req.params;
  await validate({ taskId });
  const task = await taskServices.getTask({ userId, taskId });
  res.status(200).send(task);
};

module.exports = getTask;

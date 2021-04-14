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

const removeTask = async (req, res) => {
  const userId = req.user.id;
  const { taskId } = req.params;
  await validate({ taskId });
  await taskServices.removeTask({ userId, taskId });
  res.status(204).send();
};

module.exports = removeTask;

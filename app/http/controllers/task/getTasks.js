const Joi = require('joi');

const taskServices = require('../../services/task');
const { abort } = require('../../../helpers/error');

const validate = async (params) => {
  const schema = Joi.object({
    offset: Joi.number().required(),
    limit: Joi.number().required(),
  });
  try {
    return await schema.validate(params);
  } catch (err) {
    return abort(400, 'Params error!');
  }
};

const getTasks = async (req, res) => {
  const { id: userId, task_count: taskCount } = req.user;
  const { offset, limit } = req.query;
  await validate({ offset, limit });
  const result = await taskServices.getTasks({
    userId, taskCount, offset, limit,
  });
  return res.status(200).send(result);
};

module.exports = getTasks;

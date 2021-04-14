const Joi = require('joi');

const taskServices = require('../../services/task');
const { abort } = require('../../../helpers/error');

const validate = async (params) => {
  const schema = Joi.object({
    title: Joi.string().max(127).required(),
  });
  try {
    return await schema.validate(params);
  } catch (err) {
    return abort(400, 'Params error!');
  }
};

const addTask = async (req, res) => {
  const userId = req.user.id;
  const { title } = req.body;
  await validate({ title });
  await taskServices.addTask({ userId, title });
  res.status(201).send();
};

module.exports = addTask;

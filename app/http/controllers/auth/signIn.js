const Joi = require('joi');

const authServices = require('../../services/auth');
const { abort } = require('../../../helpers/error');

const validate = async (params) => {
  const schema = Joi.object({
    email: Joi.string().max(127).email().required(),
    password: Joi.string().min(6).required(),
  });
  try {
    return await schema.validate(params);
  } catch (err) {
    return abort(400, 'Params error!');
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  await validate({ email, password });
  const token = await authServices.signIn({ email, password });
  res.status(200).send(token);
};

module.exports = signIn;

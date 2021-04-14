const Joi = require('joi');

const authServices = require('../../services/auth');
const { abort } = require('../../../helpers/error');

const validate = async (params) => {
  const schema = Joi.object({
    email: Joi.string().email().max(127).required(),
    password: Joi.string().min(6).max(127).required(),
    confirmPassword: Joi.ref('password'),
    fullName: Joi.string().max(127).required(),
  });
  try {
    return await schema.validate(params);
  } catch (err) {
    return abort(400, 'Params error');
  }
};

const signUp = async (req, res) => {
  const {
    email, password, confirmPassword, fullName,
  } = req.body.user;
  await validate({
    email, password, confirmPassword, fullName,
  });
  await authServices.signUp({ email, password, fullName });
  res.status(201).send();
};

module.exports = signUp;

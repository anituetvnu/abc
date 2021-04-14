const bcrypt = require('bcrypt');

const { User } = require('../../models');
const jwt = require('../../helpers/jwt');
const { abort } = require('../../helpers/error');

exports.signIn = async ({ email, password }) => {
  const user = await User.query().findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return abort(400, 'Email or Password not match');
  }
  const token = await jwt.generate({ userId: user.id });

  return token;
};

exports.signUp = async ({ email, password, fullName }) => {
  const saltRounds = 10;
  if (await User.query().findOne({ email })) return abort(400, 'Email already exist');
  const hashPassword = await bcrypt.hash(password, saltRounds);
  try {
    await User.query().insert({
      email,
      password: hashPassword,
      full_name: fullName,
    });
  } catch (err) {
    return abort(500, "Can't create user");
  }
  return '';
};

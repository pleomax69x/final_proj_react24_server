const User = require("./shemas/user-shema");

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const createUser = async (data) => {
  const user = await new User(data);
  return await user.save();
};

module.exports = {
  findByEmail,
  createUser,
};

const User = require("./schemas/user-schema");

const findById = async id => {
  return await User.findOne({ _id: id })
}

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

const createUser = async (data) => {
  const user = await new User(data);
  return await user.save();
};

module.exports = {
  findById,
  findByEmail,
  createUser,
};

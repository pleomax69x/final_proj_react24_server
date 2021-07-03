const Teammate = require("./schemas/teammate-schema");

const addingTeammate = async (data) => {
  try {
    const teammateData = await new Teammate(data);
    return await teammateData.save();
  } catch (err) {
    return err.message;
  }
};

const delTeammate = async (teammateId) => {
  if (teammateId) {
    try {
      const delTeammate = await Teammate.findByIdAndRemove({
        _id: teammateId,
      });
      return delTeammate;
    } catch (err) {
      return err.message;
    }
  }
};

const getAllTeammate = async (projectId) => {
  try {
    const teammates = await Teammate.find({ projectId: projectId });
    return teammates;
  } catch (err) {
    return err.message;
  }
};

module.exports = {
  getAllTeammate,
  delTeammate,
  addingTeammate,
};

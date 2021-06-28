const Sprint = require("./schemas/sprint-schema");

const createSprint = async (body, projectId) => {
  if (body || projectId) {
    const data = {
      ...body,
      projectId,
    };
    try {
      const sprintData = await new Sprint(data);
      return await sprintData.save();
    } catch (err) {
      return err.message;
    }
  }
};

module.exports = {
  createSprint,
};

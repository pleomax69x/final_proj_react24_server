const { array } = require("joi");
const mongoose = require("mongoose");
const { Schema, SchemaTypes, model } = mongoose;
const mongoosePaginate = require("mongoose-paginate-v2");

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for the project"],
    },
    description: {
      type: String,
      required: [true, "Set description for the project"],
    },
    owner: {
      type: SchemaTypes.ObjectId,
      ref: "user",
    },
    teammatesId: {
      type: Array,
      default: [],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

projectSchema.plugin(mongoosePaginate);

const Project = model("project", projectSchema);

module.exports = Project;

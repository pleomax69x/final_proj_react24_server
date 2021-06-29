const { Schema, SchemaTypes, model } = require("mongoose");

const sprintSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    date: {
      type: String,
      required: [true, "Data is required"],
    },
    duration: {
      type: Number,
      required: [true, "Duration is required"],
      default: 2,
    },
    projectId: {
      type: SchemaTypes.ObjectId,
      required: [true, "project id is required"],
      ref: "project",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Sprint = model("sprint", sprintSchema);

module.exports = Sprint;

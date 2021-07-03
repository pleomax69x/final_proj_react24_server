const { Schema, SchemaTypes, model } = require("mongoose");

const teammateSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "email is required"],
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

const Teammate = model("teammate", teammateSchema);

module.exports = Teammate;

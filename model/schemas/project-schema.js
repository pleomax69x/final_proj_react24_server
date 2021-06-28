const mongoose = require('mongoose')
const { Schema, SchemaTypes, model } = mongoose
const mongoosePaginate = require('mongoose-paginate-v2')

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for the project'],
    },
    description: {
      type: String,
      required: [true, 'Set description for the project'],
    },
    owner: {
      // type: SchemaTypes.ObjectId,
      // ref: 'user',
      type: String,
      default: '60d860d6285a02077c1cefcb',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

projectSchema.plugin(mongoosePaginate)

const Project = model('project', projectSchema)

module.exports = Project
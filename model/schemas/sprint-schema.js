const { Schema, SchemaTypes, model } = require('mongoose')

const sprintSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      index: true, // too speedup search by title
    },
    date: {
      type: String,
      required: [true, 'Date is required'],
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required'],
    },
    listOfDates: {
      type: [],
      required: [true, 'list of dates is required'],
    },
    projectId: {
      type: SchemaTypes.ObjectId,
      required: [true, 'project id is required'],
      ref: 'project',
    },
    projectOwnerId: {
      type: SchemaTypes.ObjectId,
      required: [true, 'project owner id is required'],
      ref: 'user',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

const Sprint = model('sprint', sprintSchema)

module.exports = Sprint

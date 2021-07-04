const { Schema, SchemaTypes, model } = require('mongoose')

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
    },
    scheduledHours: {
      type: Number,
      required: [true, 'Scheduled hours is required'],
      default: 2,
    },
    hoursPerDay: {
      type: Number,
      required: false,
      default: 0,
    },
    sprintId: {
      type: SchemaTypes.ObjectId,
      required: [true, 'sprint id is required'],
      ref: 'sprint',
    },
    projectOwnerId: {
      type: SchemaTypes.ObjectId,
      required: [true, 'project owner id is required'],
      ref: 'user',
    },
    createdBy: {
      type: SchemaTypes.ObjectId,
      required: [true, 'user id is required'],
      ref: 'user',
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

const Task = model('task', taskSchema)

module.exports = Task

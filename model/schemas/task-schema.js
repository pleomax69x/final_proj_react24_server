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
  },
  {
    versionKey: false,
    timestamps: true,
  },
)

const Task = model('task', taskSchema)

module.exports = Task

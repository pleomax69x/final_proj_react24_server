const mongoose = require('mongoose')

require('dotenv').config()
const uriDb = process.env.DB_HOST

const db = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  poolSize: 5,
})

mongoose.connection.on('connected', () => {
  console.log('Mongoose: Database connection successful')
})

mongoose.connection.on('error', err => {
  console.log(`Mongoose connection error: ${err.message}`)
  process.exit(1)
})

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected')
})

process.on('SIGINT', async () => {
  mongoose.connection.close(() => {
    console.log('Disconnect MongoDB')
    process.exit()
  })
})

module.exports = db

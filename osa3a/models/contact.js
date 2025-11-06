const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI
console.log('URI from models/contact.js:', url)
console.log('connecting to', url)

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phoneBookSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    minlength: 8,
    required: [true, 'User phone number required'],
    validate: {
      validator: function (v) {
        // must match 2 or 3 digits, hyphen, then 4+ digits
        // e.g. 09-1234556, 040-22334455
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.value} is invalid. Expected 2-3 digits, a hyphen, then at least 4 digits (e.g. 040-12345).`
    }
  }
})

phoneBookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', phoneBookSchema)

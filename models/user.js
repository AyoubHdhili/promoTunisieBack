const mongoose = require('mongoose');

const User = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['Client', 'Admin'],
    default: 'Client',
    required: true
  },
  address: {
    type: String,
    required: true
  },
    phone: {
      type: Number,
      required: true
    },
  birthday: {
    type: Date,
    required: true,
  },
  verificationCode: {
    type: String,
  },
});

module.exports = mongoose.model('User', User);
  
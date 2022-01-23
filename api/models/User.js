const mongoose = require('mongoose');
const { Schema } = mongoose;

const User = new Schema({
  nickname: {
    type: String
  },
  password: {
    type: String
  },
  balance: {
    type: String,
    default: 5000
  },
});

module.exports = mongoose.model('User', User);
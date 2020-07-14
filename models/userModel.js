const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: String,
  },
  password: {
    type: String,
    required: true,
    min: 3,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;

const mongoose = require("mongoose");

// Define schema for users with name, email, password, isPremiumUser, and totalExpenses fields
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPremiumUser: {
    type: Boolean,
    default: false,
  },
  totalExpenses: {
    type: Number,
    default: 0,
  },
});

//defines the structure and behavior of the User model based on the provided schema.
const User = mongoose.model("User", userSchema);

module.exports = User;

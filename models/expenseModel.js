const mongoose = require("mongoose");

/*
This code defines a Mongoose schema for expenses with required fields for date, category, description, amount, 
and userId, where userId references a User model. Then, it creates a Mongoose model named "Expense" based on this schema.


*/

const expenseSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;

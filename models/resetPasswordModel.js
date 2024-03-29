const mongoose = require("mongoose");

/*
This code defines a Mongoose schema for expenses with required fields for id, isActive, 
and userId, where userId references a User model. 
*/

const resetPasswordSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },

  /*
  The userId field in the ResetPassword schema references the User model, 
  as indicated by 'ref: "User"'. mongoose.Schema.Types.ObjectId represents 
  a unique identifier generated by MongoDB for each document in a collection.
*/
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const ResetPassword = mongoose.model("ResetPassword", resetPasswordSchema);

module.exports = ResetPassword;

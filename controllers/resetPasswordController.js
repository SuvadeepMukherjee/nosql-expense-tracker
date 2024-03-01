const path = require("path");

// Import the v4 function from the uuid library and save it in uuidv4 we generate a unique id
//in the sendMail controller , for each password change request we will use the unique id
/*
Generate a unique request ID.
  - Find the user with the provided email in the database.
  - If the user is found, create a reset request in the database.
  - Configure Sendinblue API for sending transactional emails.
  - Send an email to the user with a password reset link.

*/
const { v4: uuidv4 } = require("uuid");
const Sib = require("sib-api-v3-sdk");
const bcrypt = require("bcrypt");

const rootDir = require("../util/path");

const User = require("../models/userModel");
const ResetPassword = require("../models/resetPasswordModel");

/*
 Utility function which we use during updatePassword
 Hashes a password using bcrypt with a specified number of salt rounds.
 saltrounds=>cost factor for the hashing algorithm
*/
const saltRounds = 10;
const hashPassword = async (password) => {
  return await bcrypt.hash(password, saltRounds);
};

/*
  Express route handler: Renders the forgot-password page.
*/
exports.forgotPasswordPage = (req, res, next) => {
  const filePath = path.join(rootDir, "views", "forgotPassword.html");

  //Sending the forgot password page as response
  res.sendFile(filePath);
};

/*
  Express route handler: Renders the reset-password page.
*/
exports.resetPasswordPage = (req, res, next) => {
  const filePath = path.join(rootDir, "views", "resetPassword.html");

  //sending the resetPassword page as response
  res.sendFile(filePath);
};

/*
  Handles a POST request to the "/password/sendMail" endpoint.

  - Extract email from the request body.
  - Generate a unique request ID.
  - Find the user with the provided email in the database.
  - If the user is found, create a reset request in the database.
  - Configure Sendinblue API for sending transactional emails.
  - Send an email to the user with a password reset link.
    (The link includes the unique request ID as a parameter.)
  - Return a 200 status with a success message on successful email send.
  - Return a 404 status for an invalid email.
  - Return a 409 status for a failed password change.
*/
exports.sendMail = async (req, res, next) => {
  try {
    // Extract email from the request body
    const { email } = req.body;

    // Generate a unique requestId using uuid
    const requestId = uuidv4();

    // Find the user by email in the database
    const recepientEmail = await User.findOne({ email });

    // Check if the user exists
    if (!recepientEmail) {
      return res
        .status(404)
        .json({ message: "Please provide the registered email!" });
    }

    // Extract the id from the retrieved user data(database)
    const userId = recepientEmail._id;

    // Create a new Reset request in the ResetPassword collection (userId is a foreign key)
    await ResetPassword.create({
      id: requestId,
      isActive: true,
      userId,
    });

    // Set up Sendinblue API client
    const defaultClient = Sib.ApiClient.instance;
    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

    // Set up TransactionalEmailsApi
    const transEmailApi = new Sib.TransactionalEmailsApi();

    // Define sender and receiver information
    const sender = {
      email: "suvadeepworks@gmail.com",
      name: "Suvadeep",
    };
    const receivers = [
      {
        email,
      },
    ];

    // Send a transactional email using Sendinblue
    await transEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: "Expense Tracker Reset Password",
      textContent: "link Below",
      htmlContent: `<h3>Hi! We got the request from you for reset the password. Here is the link below >>></h3>
      <a href="http://localhost:3000/password/resetPasswordPage/${requestId}"> Click Here</a>`,
    });

    // Return a success response
    return res.status(200).json({
      message:
        "Link for resetting the password has been successfully sent to your email!",
    });
  } catch (err) {
    // Return an error response if any issues occur during the process
    console.error(err);
    return res
      .status(500)
      .json({ message: "Failed to send reset password email" });
  }
};

/*
  
  Handles a POST request to the "/password/resetPassword" endpoint.

  - Extracts the request ID from the referer header.(which we send during sendMail)
  - Extracts the new password from the request body.
  - Checks if the reset request associated with the ID is active.
  - If active, updates the reset request status to inactive.
  - Hashes the new password.
  - Updates the user's password in the database.
  - Returns a 200 status with a success message upon successful password change.
  - Returns a 409 status for a failed password change.
*/
exports.updatePassword = async (req, res, next) => {
  try {
    // Extract the requestId from the referer header
    const requestId = req.headers.referer.split("/");

    // Extract the new password from the request body
    const password = req.body.password;

    // Check for an active reset request with the given requestId
    const checkResetRequest = await ResetPassword.findOne({
      // Query the database for the _id and isActive:true
      id: requestId[requestId.length - 1],
      isActive: true,
    });
    console.log("check reset request is " + checkResetRequest);

    // If an active reset request is found
    if (checkResetRequest) {
      // Extract userId from the reset request
      const userId = checkResetRequest.userId;
      console.log("user id is " + userId);

      // Deactivate the reset request
      const result = await ResetPassword.updateOne(
        { id: requestId },
        { $set: { isActive: false } }
      );

      // Hash the new password
      const newPassword = await hashPassword(password);

      // Update the user's password with the new hashed password
      await User.findByIdAndUpdate(userId, { password: newPassword });

      return res.status(200).json({ message: "Successfully changed password" });
    } else {
      return res.status(409).json({ message: "Failed to change password!" });
    }
  } catch (err) {
    //console.log(err);
    return res.status(409).json({ message: "Failed to change password!" });
  }
};

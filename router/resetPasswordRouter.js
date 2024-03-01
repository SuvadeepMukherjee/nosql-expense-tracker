const express = require("express");

//Creates a new router object in express , allows us to group related routes together
const router = express.Router();

const resetPasswordController = require("../controllers/resetPasswordController");

router.get("/forgotPasswordPage", resetPasswordController.forgotPasswordPage);
router.post("/sendMail", resetPasswordController.sendMail);

// Captures the requestId from the URL segment after "/resetPasswordPage/".
// Uses Express to extract the captured ID and make it available as req.params.requestId.
// Passes the captured requestId to the resetPasswordPage controller function.
// In the controller, the requestId is used to identify the specific request for password reset.
router.get(
  "/resetPasswordPage/:requestId",
  resetPasswordController.resetPasswordPage
);
router.post("/resetPassword", resetPasswordController.updatePassword);

module.exports = router;

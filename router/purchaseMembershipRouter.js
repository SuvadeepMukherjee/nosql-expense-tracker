const express = require("express");

const purchaseMembershipController = require("../controllers/purchaseMembershipController");

const authenticatemiddleware = require("../middleware/auth");

//Creates a new router object in express , allows us to group related routes together
const router = express.Router();

router.get(
  "/premiumMembership",
  authenticatemiddleware,
  purchaseMembershipController.purchasePremium
);

router.post(
  "/updateTransactionStatus",
  authenticatemiddleware,
  purchaseMembershipController.updateTransactionStatus
);

module.exports = router;

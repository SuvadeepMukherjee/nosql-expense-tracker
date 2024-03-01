const express = require("express");
//Creates a new router object in express , allows us to group related routes together
const router = express.Router();

const reportsController = require("../controllers/reportsController");
const userAuthentication = require("../middleware/auth");

router.get("/getReportsPage", reportsController.getReportsPage);
router.post(
  "/dailyReports",
  userAuthentication,
  reportsController.dailyReports
);
router.post(
  "/monthlyReports",
  userAuthentication,
  reportsController.monthlyReports
);
//router.get("/download", userAuthentication, reportsController.downloadExpense);

module.exports = router;

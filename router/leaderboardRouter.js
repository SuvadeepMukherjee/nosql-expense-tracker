const express = require("express");
//Creates a new router object in express , allows us to group related routes together
const router = express.Router();

const leaderboardController = require("../controllers/leaderboardController");
router.get("/getLeaderboardPage", leaderboardController.getLeaderboardPage);
router.get("/getAllUsers", leaderboardController.getAllUsers);

module.exports = router;

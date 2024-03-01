//importing required modules
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

/*
loads  environment variables from a .env file
 */
dotenv.config();

//importing mongoose
const mongoose = require("mongoose");

//initializes an express application
const app = express();

/*
 Enable Cross-Origin Resource Sharing (CORS) to accept requests from 
 domains other than its own.
 */
app.use(cors());

// Serve static files (e.g., CSS, JS) from the "public" folder
app.use(express.static("public"));

// Parse incoming JSON data and make it available in req.body
app.use(bodyParser.json());

//importing routers
const userRouter = require("./router/userRouter");
const resetPasswordRouter = require("./router/resetPasswordRouter");
const expenseRouter = require("./router/expenseRouter");
const purchaseMembershipRouter = require("./router/purchaseMembershipRouter");
const leaderboardRouter = require("./router/leaderboardRouter");
const reportsRouter = require("./router/reportsRouter");

//importing routers for specific paths
app.use("/", userRouter);
app.use("/user", userRouter);
app.use("/password", resetPasswordRouter);
app.use("/homePage", expenseRouter);
app.use("/expense", expenseRouter);
app.use("/purchase", purchaseMembershipRouter);
app.use("/premium", leaderboardRouter);
app.use("/reports", reportsRouter);

// Syncing mongoose with the database and starting the server
mongoose
  .connect(process.env.MONGODB)
  .then((result) => {
    console.log("Connected");
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });

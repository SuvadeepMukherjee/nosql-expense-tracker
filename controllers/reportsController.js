const path = require("path");
const Expense = require("../models/expenseModel");
const rootDir = require("../util/path");

/*
  Controller Function: getReportsPage
  Description:
  This function handles requests for the Reports page.
  - Uses the 'res.sendFile' method to send the reports.html file as the response.
*/
exports.getReportsPage = (req, res, next) => {
  const filePath = path.join(rootDir, "views", "reports.html");

  //Sending the reports.html page as response
  res.sendFile(filePath);
};

/*
  Controller Function: dailyReports
  Handles a POST request to the reports/dailyReports Endpoint.
  - Retrieves the selected date from the request body.
  - Queries the database for expenses matching the retrieved date and the user ID from the request.
  - Sends the retrieved expenses as the response.
  - Any errors that occur during execution are logged to the console.
*/
exports.dailyReports = async (req, res, next) => {
  try {
    // Retrieve the 'date' property from the request body
    const date = req.body.date;
    // Query the database for expenses with a matching 'date' and 'userId', await the result
    const expenses = await Expense.find({ date: date, userId: req.user._id });
    // Send the retrieved expenses as the response
    return res.status(200).json(expenses);
  } catch (error) {
    // If an error occurs during execution, log the error to the console
    console.log(error);
  }
};

/*
  Controller Function: monthlyReports
  Handles a POST request to the reports/monthlyReports Endpoint.
  - Retrieves the selected month from the request body.
  - Retrieves the user ID from the request.
  - Queries the database for expenses matching the regex pattern for the selected month and the user ID.
  - Sends the retrieved expenses as the response.
  - Any errors that occur during execution are logged to the console.
*/
exports.monthlyReports = async (req, res, next) => {
  try {
    // Retrieve the selected month from the request body
    const month = req.body.month;
    // Retrieve the user ID from the request
    const userId = req.user._id;

    // Query the database for expenses matching the regex pattern for the selected month and the user ID, await the result
    const expenses = await Expense.find({
      date: { $regex: `.*-${month}-.*` },
      userId: userId,
    });

    // Send the retrieved expenses as the response
    return res.status(200).json(expenses);
  } catch (error) {
    // If an error occurs during execution, log the error to the console
    console.log(error);
  }
};

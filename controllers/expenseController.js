const path = require("path");
const rootDir = require("../util/path");
const Expense = require("../models/expenseModel");
const User = require("../models/userModel");

/*
  Express route handler: Renders the expense-home page.
*/
exports.getHomePage = (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "homePage.html"));
};

/**
 * addExpense controller
 * - Handles a POST request on /expense/addExpense
 * - From the client we are sending date, category, description, amount
 * - This middleware passes through the auth.js middleware
 * - Updates the totalExpenses of the authenticated user in the database.
 * - Creates a new Expense record in the database with the provided details.
 * - Responds with a 200 status, redirecting to the "/homePage".
 */

// Exporting the addExpense function as a module so it can be used elsewhere
exports.addExpense = async (req, res, next) => {
  try {
    // Extract date, category, description, and amount from the request body
    const date = req.body.date;
    const category = req.body.category;
    const description = req.body.description;
    const amount = req.body.amount;

    // Find the authenticated user by their ID
    const user = await User.findById(req.user.id);
    // Increment the totalExpenses of the user by the provided amount
    user.totalExpenses += Number(amount);
    // Save the updated user in the database
    await user.save();

    // Create a new Expense record with the provided details
    const expense = new Expense({
      date: date,
      category: category,
      description: description,
      amount: amount,
      userId: req.user.id,
    });
    // Save the new expense record in the database
    await expense.save();

    // Respond with a 200 status and redirect to the "/homePage"
    res.status(200).redirect("/homePage");
  } catch (err) {
    // Handle any errors that occur during execution
    console.log(err);
  }
};

/**
 * getAllExpenses controller
 * - Handles the GET request on the endpoint expense/getAllExpenses
 * - We are calling this controller during editing expenses(getting all expenses)
 * - This controller goes through the auth.js middleware before reaching here
 * - Retrieves all expenses associated with the authenticated user.
 * - Convert the raw data to json and send it back to the client
 * - Responds with a JSON array containing the retrieved expenses.
 */
exports.getAllExpenses = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id });
    //send the responses as json
    res.json(expenses);
  } catch (err) {
    console.log(err);
  }
};

/**
 * deleteExpense controller
 * - Handles The GET request for the endpoint expense/deleteExpense/${id}
 * - Including :id in the route path allows these routes to capture the  ID from the URL.
 * - This ID is then used to identify the specific expense to be deleted
 * - Extracts expense ID from the request parameters.
 * - Before reaching this middleware it reaches the auth.js middleware
 * - Retrieves the existing expense using the ID.
 * - Updates the totalExpenses of the authenticated user
 * - Deletes the expense record from the database.
 */

// Exporting the deleteExpense function as a module so it can be used elsewhere
exports.deleteExpense = async (req, res, next) => {
  try {
    // Extract the expense ID from the request parameters
    const id = req.params.id;
    // Find the expense with the provided ID and associated with the authenticated user
    const expense = await Expense.findOne({ _id: id, userId: req.user.id });

    // Find the authenticated user by their ID
    const user = await User.findById(req.user.id);
    // Subtract the amount of the deleted expense from the user's totalExpenses
    user.totalExpenses - +expense.amount;
    // Save the updated user in the database
    await user.save();

    // Delete the expense record from the database based on its ID and user association
    await Expense.deleteOne({ _id: id, userId: req.user.id });

    // Redirect the user to the "/homePage" after successfully deleting the expense
    res.redirect("/homePage");
  } catch (err) {
    // Log any errors that occur during execution
    console.log(err);
  }
};

/**
 * - Handles the endpoint expense/editExpense/${id}
 * - Including :id in the route path allows these routes to capture the expense ID from the URL.
 * - This ID is then used to identify the specific expense to be deleted or edited.
 * - This middleware is only reached after passing thorough the auth middleware
 * - from the client we are sending category,description,amount
 * - Extracts expense ID, category, description, and amount from the request parameters and body.
 * - Retrieves the existing expense using the ID.
 * - Updates the totalExpenses of the authenticated user by adjusting for the changes in the expense amount.
 * - Updates the expense details in the database.
 *
 */
exports.editExpense = async (req, res, next) => {
  try {
    // Extract expense ID from the request parameters
    const id = req.params.id;
    // Extract updated category, description, and amount from the request body
    const category = req.body.category;
    const description = req.body.description;
    const amount = req.body.amount;

    // Find the expense with the provided ID and associated with the authenticated user
    const expense = await Expense.findOne({ _id: id, userId: req.user.id });
    // Find the authenticated user by their ID
    const user = await User.findById(req.user.id);

    // Update user's totalExpenses by subtracting the old expense amount and adding the new one
    user.totalExpenses = user.totalExpenses - expense.amount + Number(amount);
    // Save the updated user in the database
    await user.save();

    // Update the expense record in the database with the new category, description, and amount
    await Expense.updateOne(
      { _id: id, userId: req.user.id },
      {
        category: category,
        description: description,
        amount: amount,
      }
    );

    // Redirect the user to the "/homePage" after successfully editing the expense
    res.redirect("/homePage");
  } catch (err) {
    // Log any errors that occur during execution
    console.log(err);
  }
};

/**
 * getAllExpensesforPagination Controller
 * - Handles the GET request on the endpoint expense/getAllExpenses/${pageNo}
 * - This end point first goes to the auth.js middleware
 * - an offset is a parameter used to specify the starting point from which a set of data should be retrieved
 * - Retrieves the page number from the request parameters.
 * - Sets the limit and offset for pagination based on the page number.
 * - Counts the total number of expenses for the authenticated user.
 * - Calculates the total number of pages based on the limit and total expenses.
 * - Queries the database for expenses based on the calculated offset and limit.
 * - Responds with a JSON object containing the fetched expenses and total number of pages.
 */

exports.getAllExpensesforPagination = async (req, res, next) => {
  try {
    // Retrieve the page number from the request parameters
    const pageNo = req.params.page;

    // Set the limit and offset for pagination based on the page number
    //an offset is a parameter used to specify the starting point from which a set of data should be retrieved
    const limit = 3;
    const offset = (pageNo - 1) * limit;

    // Count the total number of expenses for the authenticated user
    const totalExpenses = await Expense.countDocuments({ userId: req.user.id });

    // Calculate the total number of pages based on the limit and total expenses
    const totalPages = Math.ceil(totalExpenses / limit);

    // Query the database for expenses based on the calculated offset and limit
    const expenses = await Expense.find({ userId: req.user.id })
      .skip(offset)
      .limit(limit);

    // Respond with a JSON object containing the fetched expenses and total number of pages
    res.json({ expenses: expenses, totalPages: totalPages });
  } catch (err) {
    console.log(err);
  }
};

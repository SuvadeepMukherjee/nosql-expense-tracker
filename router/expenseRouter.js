const express = require("express");

//Creates a new router object in express , allows us to group related routes together
const router = express.Router();
const expenseController = require("../controllers/expenseController");
const userAuthentication = require("../middleware/auth");

router.get("/", expenseController.getHomePage);
router.get(
  "/getAllExpenses",
  userAuthentication,
  expenseController.getAllExpenses
);

//Including :id in the route path allows these routes to capture the  ID from the URL.
//This ID is then used to identify the specific page to be sent via pagination
router.get(
  "/getAllExpenses/:page",
  userAuthentication,
  expenseController.getAllExpensesforPagination
);

//Including :id in the route path allows these routes to capture the  ID from the URL.
//This ID is then used to identify the specific expense to be deleted or edited.
router.get(
  "/deleteExpense/:id",
  userAuthentication,
  expenseController.deleteExpense
);

router.post("/addExpense", userAuthentication, expenseController.addExpense);
router.post(
  "/editExpense/:id",
  userAuthentication,
  expenseController.editExpense
);

module.exports = router;

const path = require("path");
const rootDir = require("../util/path");
const User = require("../models/userModel");

/**
 * getLeaderboardPage controller
 * - Sends the leaderboard.html file as a response to the client.
 * - Uses the path module to construct the file path for the leaderboard.html file.
 */
exports.getLeaderboardPage = (req, res, next) => {
  const filePath = path.join(rootDir, "views", "leaderboard.html");

  //Sending the leaderboard page as response
  res.sendFile(filePath);
};

/**
 * getAllUsers controller
 * - Handles a GET request to the users/getAllUsers Endpoint.
 * - We make a GET request to this controller from the leaderboardPage.
 * - Utilizes Sequelize to perform a query on the User model.
 *   - Selects specific attributes (name, totalExpenses) from the database.
 *   - Orders the results based on total expenses in descending order.
 * - Maps the retrieved user data into a more concise format.
 * - Mapping the retrieved user data is crucial for simplifying client-side logic.
 * - Sends a JSON (array of objects) response to the client containing the formatted user data.
 */

// Exporting the getAllUsers function as a module so it can be used elsewhere
exports.getAllUsers = async (req, res, next) => {
  try {
    // Use Mongoose to query the database for user data
    // Retrieve all documents from the 'User' collection,
    //  an empty object {} means we're retrieving all documents in the collection.
    //including only the 'name' and 'totalExpenses' fields (1=include) (0=dont include)
    // Sort the retrieved documents based on the 'totalExpenses' field in descending order
    //-1 means sort in descending order

    const users = await User.find({}, { name: 1, totalExpenses: 1 }).sort({
      totalExpenses: -1,
    });

    // Map the retrieved user data into a more concise format which we will consume in our frontend
    const result = users.map((user) => ({
      name: user.name,
      totalExpenses: user.totalExpenses,
    }));

    // Send a JSON response containing the formatted user data
    res.status(200).json(result);
  } catch (error) {
    // Log any errors that occur during execution
    console.log(console.error);
    // Send an error JSON response with a 500 status code if an error occurs
    res.status(500).json({ error: "Internal Server Error" });
  }
};

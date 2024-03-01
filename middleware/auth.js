const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

/**
 During login we are genarating a token which has a payload of the following structure
{
  "userId": 9,
  "email": "helal@zohomail.in",
  "iat": 1702366097
}
during endpoints like /purchase/premiumMembership we are sending the token as headers
like axios.get("endPoint",{ headers: { Authorization: token } })
we extract the token and decode the user using jwt.verify
If the token is valid,  retrieves the corresponding user from the db and attaches it to the request (req.user).
If any error occurs, it logs the error and sends a 401 Unauthorized response with { success: false }.
 */
const authenticateMiddleware = async (req, res, next) => {
  try {
    // Extract token from the "Authorization" header
    const token = req.header("Authorization");

    // Verify and decode the JWT
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

    // Retrieve user from the database based on the decoded userID(token has a property of userId)
    const userFromDB = await User.findById(decodedUser.userId);

    // Attach the user to the request
    req.user = userFromDB;

    // Move to the next middleware
    next();
  } catch (error) {
    console.error("Error in authentication middleware:", error);

    // Send a 401 Unauthorized response with { success: false }
    return res.status(401).json({ success: false });
  }
};

module.exports = authenticateMiddleware;

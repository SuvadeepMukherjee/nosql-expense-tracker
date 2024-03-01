const Razorpay = require("razorpay");
const Order = require("../models/ordersModel");
const User = require("../models/userModel");

/**
 * purchasePremium controller
 * - Handles the endpoint /purchase/premiumMembership(GET request)
 * - before reaching this controller it goes to auth.js
 * - Initializes a new instance of Razorpay with the provided key ID and key secret.
 * - Sets the amount for the premium membership purchase.
 * - Creates a Razorpay order(rzp.orders.create()) with the specified amount
 * -It takes an asynchronous function as a callback
 *  - The callback awaits  Generating a new order record in the database with the status set to "PENDING" and
 *  - associates it with the user.
 *  - Responds to the client with the created order details and the Razorpay key ID. after the order created in db
 */
exports.purchasePremium = async (req, res) => {
  try {
    // Initialize a new instance of Razorpay with the provided key ID and key secret
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    // Set the amount for the premium service
    const amount = 50000;

    // Create a new order with Razorpay for the specified amount and currency
    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        // If there's an error during order creation, throw it as an error
        throw new Error(JSON.stringify(err));
      }
      // Retrieve the user ID from the request
      const userId = req.user.id;
      // Create a new Order document with the user ID, order ID, and status
      const newOrder = new Order({
        userId: userId,
        orderId: order.id,
        status: "PENDING",
      });
      // Save the new order to the database
      await newOrder.save();
      // Send a response with a status code of 201 and JSON data containing the order information and Razorpay key ID
      return res.status(201).json({ order, key_id: rzp.key_id });
    });
  } catch (err) {
    // If an error occurs at any point, catch it and log it to the console
    console.log(err);
    // Send a response with a status code of 403 and an error message
    res.status(403).json({ message: "Something went wrong", error: err });
  }
};

/**
 * updateTransactionStatus controller
 * - Handles the endpoint /purchase/updateTransactionStatus(POST request )
 * - Before reaching this controller it goes to auth.js
 * - Retrieves payment and order information from the request body.
 * - Finds the corresponding order in the database using the provided order ID.
 * - Updates the order status to "SUCCESSFUL" and associates the payment ID.
 * - Updates the user's status to indicate they are now a premium user.
 * - Responds to the client with a 202 status and a success message for a successful transaction.
 */

// Exporting the function as a module so it can be used elsewhere
exports.updateTransactionStatus = async (req, res) => {
  try {
    // Extracting the user ID from the request object
    const userId = req.user.id;

    // Extracting payment_id and order_id from the request body
    const { payment_id, order_id } = req.body;

    // Find the corresponding order in the database using the provided order ID
    const order = await Order.findOne({ orderId: order_id });
    // Checking if the order is not found
    if (!order) {
      // Sending a 404 response with a message if the order is not found
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order status to "SUCCESSFUL" and associate payment ID
    order.paymentid = payment_id;
    order.status = "SUCCESSFUL";
    // Saving the updated order in the database
    await order.save();

    // Update user's status to indicate they are now a premium user
    // Finding the user by ID and updating the isPremiumUser field to true
    await User.findByIdAndUpdate(req.user._id, { isPremiumUser: true });

    // Sending a 202 response with a success message for a successful transaction
    return res
      .status(202)
      .json({ success: true, message: "Transaction Successful" });
  } catch (err) {
    // Handling any errors that occur during execution
    // Sending a 500 response with an error message if an error occurs
    return res
      .status(500)
      .json({ message: "Something went wrong", error: err });
  }
};

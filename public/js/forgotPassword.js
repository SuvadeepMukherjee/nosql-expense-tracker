//DOM element
const resetPasswordLinkBtn = document.getElementById("resetPasswordLinkBtn");

/*
  This asynchronous function handles the process of sending a password reset email
  when called in response to a form submission. It prevents the default form submission,
  retrieves the user's email from the form, sends a POST request to the server's
  "/password/sendMail" endpoint with the email information, and displays success or
  error messages based on the server's response. In case of success, it alerts the user
  with the response message and redirects to the login page. In case of an error, it
  displays an alert with the error message and reloads the current window.
*/
async function sendMail(event) {
  try {
    event.preventDefault();

    //Get the email value from the input field
    const emailInput = document.getElementById("email");
    const email = emailInput.value;

    //Make a POST request to send the mail
    const res = await axios.post("http://localhost:3000/password/sendMail", {
      email: email,
    });

    //Display a success message
    alert(res.data.message);

    //Redirect to the login page
    window.location.href = "/user/login";
  } catch (error) {
    //display the error
    alert(error.response.data.message);
    window.location.reload();
  }
}

resetPasswordLinkBtn.addEventListener("click", sendMail);

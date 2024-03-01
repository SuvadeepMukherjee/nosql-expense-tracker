const resetPasswordBtn = document.getElementById("resetPasswordBtn");

/*
  Asynchronous function for updating the user's password.
  Invoked in response to a form submission for password reset.

  - Prevents the default form submission behavior.
  - Retrieves the new password from the form input.
  - Sends a POST request to the server's "/password/resetPassword" endpoint
    with the new password information.
  - Displays an alert with the server response message.
  - Redirects to the login page upon successful password reset.
  - In case of an error, logs the error to the console, displays an alert
    with the error message, and reloads the current window.
*/
async function updatePassword(e) {
  e.preventDefault();
  try {
    const newPassword = document.getElementById("newPassword").value;
    const res = await axios.post(
      "http://localhost:3000/password/resetPassword",
      {
        password: newPassword,
      }
    );
    console.log("here");
    console.log(res.data.message);
    alert(res.data.message);
    window.location.href = "/user/login";
  } catch (error) {
    console.log(error);
    alert(error.response.data.message);
    window.location.reload();
  }
}

resetPasswordBtn.addEventListener("click", updatePassword);

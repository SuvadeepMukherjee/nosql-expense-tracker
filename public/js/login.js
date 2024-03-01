//DOM elements
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const backendResponse = document.querySelector("#backend-response");

/*
  This asynchronous function handles user login when called in response to a form submission.
  It extracts user input (email and password) from the form, sends a POST request to the server
  for user login, and takes appropriate actions based on the server's response, such as
  storing the JWT token on successful login or displaying error messages for login failures.
*/
async function loginUser(e) {
  e.preventDefault();

  // Extract email and password values from the form
  const emailValue = email.value;
  const passwordValue = password.value;

  // Create an object with user login data
  let obj = {
    emailValue,
    passwordValue,
  };

  try {
    // Send a POST request to the server for user login
    const response = await axios.post("http://localhost:3000/user/login", obj);

    // Check if the login was successful (status code 200)
    if (response.status === 200) {
      // Store the JWT token in the local storage
      localStorage.setItem("token", response.data.token);

      // Log success message, show alert, and redirect to the home page
      console.log("Successfully logged in");
      alert("You are successfully logged in to your account");
      window.location.href = "/homePage";
    }
  } catch (err) {
    // Handle different error scenarios based on status codes
    if (err.response.status === 401) {
      backendResponse.innerHTML = "Incorrect password";
    } else if (err.response.status === 404) {
      backendResponse.innerHTML = "User does not exist";
    } else if (err.response.status === 500) {
      backendResponse.innerHTML = "Server error";
    }
  }
}

//event listeners
document.getElementById("form").addEventListener("submit", loginUser);

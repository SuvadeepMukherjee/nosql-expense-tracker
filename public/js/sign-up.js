//DOM elements
const name = document.getElementById("namee");
const email = document.getElementById("email");
const password = document.getElementById("password");
const backendResponse = document.getElementById("backend-response");

// Handles user signup, sends a POST request with user data to the server using axios,
// and redirects to the login page upon success. Displays an error message if the email already exists.
async function createUser(event) {
  event.preventDefault();

  //Extract values from form inputs
  const nameValue = namee.value;
  const emailValue = email.value;
  const passwordValue = password.value;

  //create user object
  let obj = {
    nameValue,
    emailValue,
    passwordValue,
  };
  console.log(obj);
  axios
    .post("http://localhost:3000/user/signup", obj)
    .then((response) => {
      if (response.status === 200) {
        window.location.href = "/user/login";
      }
    })
    .catch((err) => {
      if (err.response.status === 409) {
        //display a user-friendly error message
        backendResponse.innerHTML = "Email Already Exists";
      }
    });
}

//event listeners
document.getElementById("form").addEventListener("submit", createUser);

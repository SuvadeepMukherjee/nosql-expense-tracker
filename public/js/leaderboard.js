//selecting dom elements
const categoryItems = document.querySelectorAll(".dropdown-item");
const categoryInput = document.querySelector("#categoryInput");
const categoryBtn = document.querySelector("#categoryBtn");
const tbody = document.getElementById("tbodyId");
const logoutBtn = document.getElementById("logoutBtn");

/**
 * Event Listener for Category Items
 * - Iterates through each category item in the categoryItems collection.
 * - Listens for a click event on each category item.
 * - Retrieves the selected category value from the clicked item's "data-value" attribute.
 * - Updates the text content of the categoryBtn with the selected category name.
 * - Sets the value of the categoryInput hidden field to the selected category.
 **/
categoryItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    const selectedCategory = e.target.getAttribute("data-value");
    categoryBtn.textContent = e.target.textContent;
    categoryInput.value = selectedCategory;
  });
});

/**
 * getLeaderboard function
 * - Makes an asynchronous request to the server to retrieve information about all users.
 * - Displays user data in a leaderboard format, including position, name, and total expenses.
 * - Dynamically creates table rows (tr) and cells (th, td) for each user.
 * - Appends the created elements to the table body (tbody) in the HTML document.
 */

async function getLeaderboard() {
  const res = await axios.get("http://localhost:3000/premium/getAllUsers");
  let position = 1;

  res.data.forEach((user) => {
    let name = user.name;
    let amount = user.totalExpenses;

    let tr = document.createElement("tr");
    tr.setAttribute("class", "trStyle");

    tbody.appendChild(tr);

    let th = document.createElement("th");
    th.setAttribute("scope", "row");
    th.appendChild(document.createTextNode(position++));

    let td1 = document.createElement("td");
    td1.appendChild(document.createTextNode(name));

    let td2 = document.createElement("td");
    td2.appendChild(document.createTextNode(amount));

    tr.appendChild(th);
    tr.appendChild(td1);
    tr.appendChild(td2);
  });
}

/**
 * logout function
 * - clears the localStorage to remove user data.
 * - Redirects the user to the login page.
 */
async function logout() {
  try {
    localStorage.clear();
    window.location.href = "/user/login";
  } catch (error) {
    console.log(error);
  }
}

//event listeners
document.addEventListener("DOMContentLoaded", getLeaderboard);
logoutBtn.addEventListener("click", logout);

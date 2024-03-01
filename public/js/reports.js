//DOM elements
const dateInput = document.getElementById("date");
const dateShowBtn = document.getElementById("dateShowBtn");
const tbodyDaily = document.getElementById("tbodyDailyId");
const tfootDaily = document.getElementById("tfootDailyId");
const monthInput = document.getElementById("month");
const monthShowBtn = document.getElementById("monthShowBtn");
const tbodyMonthly = document.getElementById("tbodyMonthlyId");
const tfootMonthly = document.getElementById("tfootMonthlyId");
const logoutBtn = document.getElementById("logoutBtn");
const downloadBtn = document.getElementById("downloadExpense");

/*
  Function: getDailyReport

  Description:
  This asynchronous function handles the submission of a form to fetch and display daily expense reports.
  - Retrieves the authorization token from local storage.
  - Formats the selected date for the report.
  - Makes an asynchronous POST request to the server to fetch daily reports.
  - Populates the HTML table with the fetched data and calculates the total amount.
  - Handles errors by logging them to the console.
*/
async function getDailyReport(e) {
  try {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const date = new Date(dateInput.value);
    const formattedDate = `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;

    let totalAmount = 0;
    const res = await axios.post(
      "http://localhost:3000/reports/dailyReports",
      {
        date: formattedDate,
      },
      { headers: { Authorization: token } }
    );

    tbodyDaily.innerHTML = "";
    tfootDaily.innerHTML = "";

    res.data.forEach((expense) => {
      totalAmount += expense.amount;

      const tr = document.createElement("tr");
      tr.setAttribute("class", "trStyle");
      tbodyDaily.appendChild(tr);

      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.appendChild(document.createTextNode(expense.date));

      const td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(expense.category));

      const td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(expense.description));

      const td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(expense.amount));

      tr.appendChild(th);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
    });

    const tr = document.createElement("tr");
    tr.setAttribute("class", "trStyle");
    tfootDaily.appendChild(tr);

    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");

    td3.setAttribute("id", "dailyTotal");
    td4.setAttribute("id", "dailyTotalAmount");
    td3.appendChild(document.createTextNode("Total"));
    td4.appendChild(document.createTextNode(totalAmount));

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
  } catch (error) {
    console.log(error);
  }
}

/*
  Function: getMonthlyReport

  Description:
  This asynchronous function handles the submission of a form to fetch and display monthly expense reports.
  - Retrieves the authorization token from local storage.
  - Formats the selected month for the report.
  - Makes an asynchronous POST request to the server to fetch monthly reports.
  - Populates the HTML table with the fetched data and calculates the total amount.
  - Handles errors by logging them to the console.

*/
/*
  Event Handler: getMonthlyReport

  Description:
  Initiates fetching and displaying of monthly expense reports.
*/
async function getMonthlyReport(e) {
  try {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const month = new Date(monthInput.value);
    const formattedMonth = `${(month.getMonth() + 1)
      .toString()
      .padStart(2, "0")}`;

    let totalAmount = 0;
    const res = await axios.post(
      "http://localhost:3000/reports/monthlyReports",
      {
        month: formattedMonth,
      },
      { headers: { Authorization: token } }
    );

    tbodyMonthly.innerHTML = "";
    tfootMonthly.innerHTML = "";

    res.data.forEach((expense) => {
      totalAmount += expense.amount;

      const tr = document.createElement("tr");
      tr.setAttribute("class", "trStyle");
      tbodyMonthly.appendChild(tr);

      const th = document.createElement("th");
      th.setAttribute("scope", "row");
      th.appendChild(document.createTextNode(expense.date));

      const td1 = document.createElement("td");
      td1.appendChild(document.createTextNode(expense.category));

      const td2 = document.createElement("td");
      td2.appendChild(document.createTextNode(expense.description));

      const td3 = document.createElement("td");
      td3.appendChild(document.createTextNode(expense.amount));

      tr.appendChild(th);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
    });

    const tr = document.createElement("tr");
    tr.setAttribute("class", "trStyle");
    tfootMonthly.appendChild(tr);

    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");

    td3.setAttribute("id", "monthlyTotal");
    td4.setAttribute("id", "monthlyTotalAmount");
    td3.appendChild(document.createTextNode("Total"));
    td4.appendChild(document.createTextNode(totalAmount));

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
  } catch (error) {
    console.log(error);
  }
}

/*
  Event Handler: logout

  Description:
  Logs out the user by clearing the local storage and redirecting to the login page.
*/
function logout() {
  try {
    localStorage.clear();
    window.location.href = "/user/login";
  } catch (error) {
    console.log(error);
  }
}

/**
 * Function: download
 * - Initiates a file download by making a GET request to a server endpoint.
 * - The request includes an authorization token retrieved from the local storage.
 * - If the server responds with a 201 status code, it extracts the file URL
 *   from the response and triggers a download for the file named "myexpense.csv".
 * - In case of any errors, the function logs the error to the console.
 */
async function download() {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get("http://localhost:3000/reports/download", {
      headers: { Authorization: token },
    });
    if (response.status === 200) {
      const fileURL = response.data.fileURL;

      // Triggering download for the file named "myexpense.csv"
      const a = document.createElement("a");
      a.style.display = "none";
      document.body.appendChild(a);
      a.href = fileURL;
      a.download = "myexpense.csv";
      a.click();
      document.body.removeChild(a);
    }
  } catch (error) {
    console.log(error);
  }
}

//event listeners
dateShowBtn.addEventListener("click", getDailyReport);
monthShowBtn.addEventListener("click", getMonthlyReport);
logoutBtn.addEventListener("click", logout);
//downloadBtn.addEventListener("click", download);

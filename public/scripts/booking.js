const searchBtn = document.getElementById("search-btn");
const bookingBtn = document.getElementById("new-booking-btn");
const backBtn = document.getElementById("back-btn");

backBtn.classList.add("btn");
backBtn.style.display = "none";

const formFieldSectionElement = document.getElementById("form-field");
const controlFieldSectionElement = document.getElementById("controll-field");
const resultFieldElement = document.getElementById("result-field");

const roomNumbers = [
  "1-1",
  "1-2",
  "1-3",
  "1-4",
  "2-1",
  "2-2",
  "2-3",
  "2-4",
  "3-1",
  "3-2",
  "3-3",
  "3-4",
];

////////////// back button ///////////////////
function goToLandingPage(event) {
  backBtn.style.display = "none";
  formFieldSectionElement.innerHTML = "";
  resultFieldElement.innerHTML = "";
  searchBtn.style.display = "inline-block";
  searchBtn.nextElementSibling.style.display = "inline-block";

  controlFieldSectionElement.classList.add("main-controll");
  controlFieldSectionElement.classList.remove("nav-look");
  controlFieldSectionElement.classList.remove("success-controll");
}

function hideControllBtns() {
  bookingBtn.style.display = "none";
  searchBtn.style.display = "none";
}

function createBackBtn() {
  backBtn.style.display = "block";
  controlFieldSectionElement.classList.add("nav-look");

  backBtn.addEventListener("click", goToLandingPage);
}
/////////////////////////////////////////
////////// search tab ///////////////////
/////////////////////////////////////////
searchBtn.addEventListener("click", loadSearchView);

function loadSearchView(event) {
  formFieldSectionElement.innerHTML = `<form>
    <p>
        <label for="room-number">ოთახის ნომერი</label>
        <select name="room-number" id="room-number">
        <option value selected  >აირჩიეთ ოთახი</option>
        </select>
    </p>
    <p>
      <label for="booking-source">ჯავშნის წყარო</label>
      <select name="booking-source" id="booking-source">
        <option value selected>აირჩიეთ წყარო</option>
        <option value="facebook">Facebook</option>
        <option value="suggestion">Friend Suggested</option>
        <option value="booking.com">Booking.com</option>
        <option value="taxi">taxi driver</option>
        <option value="other">other</option>
      </select>
    </p>
    <p>
        <label for="date">თარიღი</label>
        <input type="date" name="date-start" id="date-start" required>
        <input type="date" name="date-end" id="date-end" required>

    </p>
    <hr>
    <button class="btn">ძებნა <i class="fa-solid fa-magnifying-glass"></i></button>
    </form>`;
  controlFieldSectionElement.classList.remove("main-controll");

  const roomNumberSelectElement = document.getElementById("room-number");
  for (const room of roomNumbers) {
    const roomOptionElement = document.createElement("option");
    roomOptionElement.value = room;
    roomOptionElement.textContent = room;
    roomNumberSelectElement.appendChild(roomOptionElement);
    if (event.target.textContent === room) {
      roomOptionElement.selected = "selected";
    }
  }

  if (sessionStorage.dates || !sessionStorage.dates === null) {
    const dates = JSON.parse(sessionStorage.dates);
    document.getElementById("date-start").value = dates.startDate;
    document.getElementById("date-end").value = dates.endDate;
    sessionStorage.clear();
  }

  hideControllBtns();

  createBackBtn();
  formFieldSectionElement.firstElementChild.addEventListener(
    "submit",
    loadBookedRooms
  );
}

async function loadBookedRooms(event) {
  if (event) {
    event.preventDefault();
  }

  let enteredData = {
    startDate: document.getElementById("date-start").value,
    endDate: document.getElementById("date-end").value,
  };

  if (
    document.getElementById("room-number") &&
    !document.getElementById("booking-source")
  ) {
    const roomNumber = {
      room: document.getElementById("room-number").value,
    };
    enteredData = {
      ...enteredData,
      ...roomNumber,
    };
  } else if (
    document.getElementById("booking-source") &&
    !document.getElementById("room-number")
  ) {
    const bookingSource = {
      room: document.getElementById("booking-source").value,
    };
    enteredData = {
      ...enteredData,
      ...bookingSource,
    };
  } else if (
    document.getElementById("room-number") &&
    document.getElementById("booking-source")
  ) {
    const bookingFilter = {
      room: document.getElementById("room-number").value,
      source: document.getElementById("booking-source").value,
    };
    enteredData = {
      ...enteredData,
      ...bookingFilter,
    };
  }

  let response;
  try {
    response = await fetch("/getBookedRooms", {
      method: "POST",
      body: JSON.stringify(enteredData),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("something went wrong!!");
    return;
  }

  if (!response.ok) {
    alert("something went wrong!");
    return;
  }

  const bookedRooms = await response.json();
  if (!bookedRooms.bookings || bookedRooms.bookings.length === 0) {
    resultFieldElement.innerHTML = "";
    let errorMessageElement = document.createElement("p");
    errorMessageElement.classList.add("error-message");
    errorMessageElement.textContent = "მითითებულ თარიღებში ჯავშანი არაა!!";
    resultFieldElement.appendChild(errorMessageElement);
    return;
  }

  resultFieldElement.innerHTML = `
  <table id="result-table">
  <thead>
  <tr id="table-header">
    <th onclick="sortTable(0)"><div><p>ჯავშნის სახელი</p> <i class="fa-solid fa-sort"></i></div></th>
    <th onclick="sortTable(1)"><div><p>ჯავშნის წყარო</p> <i class="fa-solid fa-sort"></i></div></th>
    <th onclick="sortTable(2)"><div><p>ოთახის ნომერი</p> <i class="fa-solid fa-sort"></i></div></th>
    <th onclick="sortTable(3, true)"><div><p>თარიღი დან</p> <i class="fa-solid fa-sort"></i></div></th>
    <th onclick="sortTable(4, true)"><div><p>თარიღი მდე</p> <i class="fa-solid fa-sort"></i></div></th>
    <th id="icon-column"></th>
  </tr>
  </thead>
  <tbody></tbody>
  </table>
  `;
  createResultTable(bookedRooms.bookings);
}

function createResultTable(bookingsArray) {
  const resultTableElement =
    document.getElementById("result-table").lastElementChild;

  for (const booking of bookingsArray) {
    const tableRowElement = document.createElement("tr");
    resultTableElement.appendChild(tableRowElement);
    booking.startDate = new Date(booking.startDate).toLocaleDateString(
      "en-GB",
      { year: "numeric", month: "numeric", day: "numeric" }
    );
    booking.endDate = new Date(booking.endDate).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
    let i;
    for (i = 0; i < Object.keys(booking).length; i++) {
      const tdElement = document.createElement("td");
      tableRowElement.appendChild(tdElement);
      tdElement.textContent = Object.values(booking)[i];
      if (i === Object.keys(booking).length - 1) {
        tdElement.innerHTML = "";

        const deleteButton = document.createElement("i");
        const editButton = document.createElement("i");

        deleteButton.dataset.bookingid = booking.id;
        deleteButton.classList.add("fa-regular", "fa-trash-can");
        editButton.dataset.bookingid = booking.id;
        editButton.classList.add("fa-regular", "fa-pen-to-square");

        tdElement.appendChild(deleteButton);
        tdElement.appendChild(editButton);
        deleteButton.addEventListener("click", deleteBooking);
        editButton.addEventListener("click", loadBookingEditForm);
      }
    }
  }
}

////////////////////////////////////////
// edit and delete booking functions  //
////////////////////////////////////////

async function deleteBooking(event) {
  const bookingId = event.target.dataset.bookingid;

  const response = await fetch("/bookings/" + bookingId, {
    method: "DELETE",
  });
  if (!response.ok) {
    alert("something went wrong");
    return;
  }
  loadBookedRooms();
}

async function loadBookingEditForm(event) {
  const bookingId = event.target.dataset.bookingid;
  const response = await fetch("booking/" + bookingId);
  const responseData = await response.json();
  const valuesArray = Object.values(responseData.booking);

  const sourceInputElement = document.createElement("p");
  sourceInputElement.innerHTML = `
    <label for="booking-name">ჯავშნის სახელი</label>
    <input
      type="text"
      id="booking-name"
      name="booking-name"
      required
      maxlength="60"
    />
  `;
  const formField = formFieldSectionElement.firstElementChild;
  formField.appendChild(sourceInputElement);

  formField.insertBefore(sourceInputElement, formField.children[0]);
  const selectInputs = document.querySelectorAll("#form-field select");
  for (const selectinput of selectInputs) {
    for (const option of selectinput) {
      if (valuesArray.includes(option.value)) {
        option.selected = "selected";
      }
    }
  }
  document.querySelector("#booking-name").value = responseData.booking.name;
  document.querySelector("#date-start").value =
    responseData.booking.startDate.substring(0, 10);
  document.querySelector("#date-end").value =
    responseData.booking.endDate.substring(0, 10);

  formField.lastElementChild.textContent = "შენახვა";
  formField.removeEventListener("submit", loadBookedRooms);
  formField.dataset.bookingid = bookingId;
  formField.addEventListener("submit", saveUpdatedBooking);
  resultFieldElement.innerHTML = "";
}

async function saveUpdatedBooking(event) {
  event.preventDefault();
  const submitData = {
    name: document.getElementById("booking-name").value,
    source: document.getElementById("booking-source").value,
    room: document.getElementById("room-number").value,
    startDate: document.getElementById("date-start").value,
    endDate: document.getElementById("date-end").value,
  };

  let response;
  try {
    response = await fetch("/bookings/" + event.target.dataset.bookingid, {
      method: "PATCH",
      body: JSON.stringify(submitData),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("something went wrong!");
    return;
  }

  if (!response.ok) {
    alert("something went wrong!");
    return;
  }
  const bookingdata = await response.json();
  bookingResponse(bookingdata.message, bookingdata.status);
}

////////////////////////////////////////////
/// function for sorting table///
///////////////////////////////////////////
function sortTable(n, typeDate = false) {
  var table,
    header,
    rows,
    switching,
    i,
    x,
    xDate,
    y,
    yDate,
    shouldSwitch,
    dir,
    switchcount = 0;
  table = document.getElementById("result-table");
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < rows.length - 1; i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      // console.log(x.innerHTML.split("/").reverse().join("/"));

      if (typeDate) {
        xDate = new Date(x.innerHTML.split("/").reverse().join("/"));
        yDate = new Date(y.innerHTML.split("/").reverse().join("/"));
      }
      if (dir == "asc") {
        if (typeDate) {
          if (xDate > yDate) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else {
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      } else if (dir == "desc") {
        if (typeDate) {
          if (xDate < yDate) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        } else {
          if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
  header = rows[0].getElementsByTagName("TH")[n];

  // adds sorting symbol
  if (dir === "asc") {
    header.firstElementChild.lastElementChild.classList.remove(
      "fa-sort-down",
      "fa-sort"
    );
    header.firstElementChild.lastElementChild.classList.add("fa-sort-up");
  } else if (dir === "desc") {
    header.firstElementChild.lastElementChild.classList.remove(
      "fa-sort-up",
      "fa-sort"
    );
    header.firstElementChild.lastElementChild.classList.add("fa-sort-down");
  }

  for (i = 0; i < rows[0].getElementsByTagName("TH").length - 1; i++) {
    if (i === n) {
      continue;
    }
    const IconElement =
      rows[0].getElementsByTagName("TH")[i].firstElementChild.lastElementChild;
    IconElement.classList.remove("fa-sort-up", "fa-sort-down");
    IconElement.classList.add("fa-sort");
  }
}

//////////////////////////////////////////
///////// open booking form //////////////
//////////////////////////////////////////
function loadBookingFirstForm() {
  formFieldSectionElement.innerHTML = `<form>
  
  <p>
    <label>თარიღი</label>
    <input type="date" name="date-start" id="date-start" required>
    <input type="date" name="date-end" id="date-end" required>
  </p>
  <hr>
  <button class="btn">ძებნა <i class="fa-solid fa-magnifying-glass"></i></button>
</form>
`;

  hideControllBtns();

  createBackBtn();

  formFieldSectionElement.firstElementChild.addEventListener(
    "submit",
    getFreeRooms
  );

  if (sessionStorage.dates || !sessionStorage.dates === null) {
    const dates = JSON.parse(sessionStorage.dates);
    document.getElementById("date-start").value = dates.startDate;
    document.getElementById("date-end").value = dates.endDate;
    getFreeRooms();
    sessionStorage.clear();
  }

  backBtn.removeEventListener("click", loadBookingFirstForm);
  backBtn.addEventListener("click", goToLandingPage);
}

bookingBtn.addEventListener("click", loadBookingFirstForm);

/////////////////////////
////// get free rooms////
////////////////////////

async function getFreeRooms(event) {
  if (event) {
    event.preventDefault();
  }

  let enteredDates = {
    startDate: document.getElementById("date-start").value,
    endDate: document.getElementById("date-end").value,
  };

  if (sessionStorage.dates || !sessionStorage.dates === null) {
    enteredDates = JSON.parse(sessionStorage.dates);
    sessionStorage.clear();
  }

  let response;
  try {
    response = await fetch("/getFreeRooms", {
      method: "POST",
      body: JSON.stringify(enteredDates),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("something went wrong!");
    return;
  }

  if (!response.ok) {
    alert("something went wrong!");
    return;
  }

  const responseData = await response.json();

  let errorMessageElement = document.createElement("p");
  errorMessageElement.classList.add("error-message");
  if (!responseData.status && !Array.isArray(responseData)) {
    if (
      formFieldSectionElement.firstElementChild !==
      document.querySelector("#form-field .error-message")
    ) {
      formFieldSectionElement.insertBefore(
        errorMessageElement,
        formFieldSectionElement.firstChild
      );
    }
    formFieldSectionElement.firstElementChild.textContent =
      responseData.message;
    resultFieldElement.innerHTML = "";
  } else if (
    responseData.status === true ||
    Array.isArray(responseData) ||
    responseData.status === "notFree"
  ) {
    if (document.querySelector("#form-field .error-message")) {
      document.querySelector("#form-field .error-message").remove();
    }
  }

  //// list of free rooms for selected period
  if (Array.isArray(responseData)) {
    createListOfFreeRooms(responseData);
  } else if (responseData.status === "notFree") {
    if (document.getElementById("error-message")) {
      document.getElementById("error-message").remove();
    }
    resultFieldElement.appendChild(document.createElement("p"));
    resultFieldElement.firstElementChild.classList.add("response-text");
    resultFieldElement.firstElementChild.textContent = responseData.message;
  }
}

// creates unordered list for free rooms
function createListOfFreeRooms(freeRoomsArray) {
  resultFieldElement.innerHTML = "";
  const freeRoomsListElement = document.createElement("ul");
  freeRoomsListElement.id = "free-rooms";
  resultFieldElement.appendChild(freeRoomsListElement);
  for (const room of freeRoomsArray) {
    const roomElementContainer = document.createElement("li");
    roomElementContainer.classList.add("room-list-item");
    freeRoomsListElement.appendChild(roomElementContainer);
    const roomNameElement = document.createElement("p");
    roomElementContainer.appendChild(roomNameElement);
    roomNameElement.textContent = room;

    roomElementContainer.addEventListener("click", startBookingOnThisRoom);
  }
}

function startBookingOnThisRoom(event) {
  const dates = {
    startDate: new Date(document.getElementById("date-start").value)
      .toISOString()
      .substring(0, 10),
    endDate: new Date(document.getElementById("date-end").value)
      .toISOString()
      .substring(0, 10),
  };
  sessionStorage.setItem("dates", JSON.stringify(dates));
  backBtn.removeEventListener("click", goToLandingPage);
  backBtn.addEventListener("click", loadBookingFirstForm);

  formFieldSectionElement.innerHTML = `<form>
    <p>
    <label for="booking-name">ჯავშნის სახელი</label>
    <input
      type="text"
      id="booking-name"
      name="booking-name"
      required
      maxlength="60"
    />
    </p>
    <p>
      <label for="booking-source">ჯავშნის წყარო</label>
      <select name="booking-source" id="booking-source" required>
        <option value="facebook">Facebook</option>
        <option value="suggestion">Friend Suggested</option>
        <option value="booking.com">Booking.com</option>
        <option value="taxi">taxi driver</option>
        <option value="other">other</option>
      </select>
    </p>
    <p>
      <label for="room-number">ოთახის ნომერი</label>
      <select name="room-number" id="room-number" required></select>
    </p>
      <p>
        <label>თარიღი</label>
        <input type="date" value=${dates.startDate} name="date-start" id="date-start" required>
        <input type="date" value=${dates.endDate} name="date-end" id="date-end" required>
      </p>
      <hr>
      <button class="btn">დაჯავშნა</button>
    </form>`;

  const roomNumberSelectElement = document.getElementById("room-number");
  for (const room of roomNumbers) {
    const roomOptionElement = document.createElement("option");
    roomOptionElement.value = room;
    roomOptionElement.textContent = room;
    roomNumberSelectElement.appendChild(roomOptionElement);
    if (event.target.textContent === room) {
      roomOptionElement.selected = "selected";
    }
  }
  resultFieldElement.innerHTML = "";

  formFieldSectionElement.firstElementChild.addEventListener(
    "submit",
    submitBooking
  );
}

/////////////////////////
//// send booking post///
/////////////////////////
async function submitBooking(event) {
  event.preventDefault();
  const submitData = {
    name: document.getElementById("booking-name").value,
    source: document.getElementById("booking-source").value,
    room: document.getElementById("room-number").value,
    startDate: document.getElementById("date-start").value,
    endDate: document.getElementById("date-end").value,
  };

  let response;
  try {
    response = await fetch("/newbooking", {
      method: "POST",
      body: JSON.stringify(submitData),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    alert("something went wrong!");
    return;
  }

  if (!response.ok) {
    alert("something went wrong!");
    return;
  }
  const bookingdata = await response.json();
  bookingResponse(bookingdata.message, bookingdata.status);
}

function bookingResponse(message, status) {
  if (status) {
    formFieldSectionElement.innerHTML = "";
    formFieldSectionElement.appendChild(document.createElement("p"));
    formFieldSectionElement.firstElementChild.innerHTML = `<i class="fa-regular fa-circle-check"></i> ${message}`;
    formFieldSectionElement.firstElementChild.classList.add("response-text");
    bookingBtn.style.display = "inline-block";
    controlFieldSectionElement.classList.add("success-controll");
    backBtn.removeEventListener("click", loadBookingFirstForm);
    backBtn.addEventListener("click", goToLandingPage);
  } else {
    if (!document.getElementById("error-message")) {
      formFieldSectionElement.insertBefore(
        document.createElement("p"),
        formFieldSectionElement.firstChild
      );
      formFieldSectionElement.firstElementChild.id = "error-message";
    }
    formFieldSectionElement.firstElementChild.classList.add("error-message");
    formFieldSectionElement.firstElementChild.textContent = message;
  }
}

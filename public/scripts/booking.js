const searchBtn = document.getElementById("search-btn");
const bookingBtn = document.getElementById("new-booking-btn");
const backBtn = document.createElement("button");

const formFieldSectionElement = document.getElementById("form-field");
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
  event.target.remove();
  formFieldSectionElement.innerHTML = "";
  resultFieldElement.innerHTML = "";
  searchBtn.style.display = "inline-block";
  searchBtn.nextElementSibling.style.display = "inline-block";
}

function hideControllBtns() {
  bookingBtn.style.display = "none";
  searchBtn.style.display = "none";
}

function createBackBtn(parrentElement) {
  backBtn.textContent = "უკან";
  backBtn.id = "back-btn";
  parrentElement.appendChild(backBtn);
  backBtn.addEventListener("click", goToLandingPage);
}
/////////////////////////////////////////
////////// search tab ///////////////////
/////////////////////////////////////////
function loadSearchView() {
  formFieldSectionElement.innerHTML = `<form>
    <p>
        <label for="room-number">ოთახის ნომერი</label>
        <select name="room-number" id="room-number">
            <option>1-1</option>
            <option >1-2</option>
            <option>2-2</option>
        </select>
    </p>
    <p>
        <label for="date">თარიღი</label>
        <input type="date" name="start-date" id="start-date">
        <input type="date" name="end-date" id="end-date">

    </p>
    <button>ძებნა</button>
    </form>`;

  hideControllBtns();

  createBackBtn(searchBtn.parentElement);
}

searchBtn.addEventListener("click", loadSearchView);
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
  <button>ძებნა</button>
</form>
`;

  hideControllBtns();

  createBackBtn(bookingBtn.parentElement);

  formFieldSectionElement.firstElementChild.addEventListener(
    "submit",
    getFreeRooms
  );

  if(sessionStorage.dates || !sessionStorage.dates === null){
    const dates = JSON.parse(sessionStorage.dates)
    document.getElementById('date-start').value = dates.startDate
    document.getElementById('date-end').value = dates.endDate
    getFreeRooms()
    sessionStorage.clear()
  }

  backBtn.removeEventListener("click", loadBookingFirstForm);
  backBtn.addEventListener("click", goToLandingPage);
}

bookingBtn.addEventListener("click", loadBookingFirstForm);

/////////////////////////
////// get free rooms////
////////////////////////

async function getFreeRooms(event) {
  if(event){
    event.preventDefault();
  }

  let enteredDates = {
    startDate: document.getElementById("date-start").value,
    endDate: document.getElementById("date-end").value,
  };
  
  if(sessionStorage.dates || !sessionStorage.dates === null){
    enteredDates = JSON.parse(sessionStorage.dates)
    console.log(enteredDates);
    sessionStorage.clear()
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
  if (!responseData.status) {
    if (!document.getElementById("error-message")) {
      formFieldSectionElement.insertBefore(
        document.createElement("p"),
        formFieldSectionElement.firstChild
      );
      formFieldSectionElement.firstElementChild.id = "error-message";
    }
    formFieldSectionElement.firstElementChild.textContent =
      responseData.message;
    resultFieldElement.innerHTML = "";
  } else if (responseData.status === true) {
    document.getElementById("error-message").remove();
  }

  //// list of free rooms for selected period
  if (Array.isArray(responseData)) {
    createListOfFreeRooms(responseData);
  } else if (responseData.status === "notFree") {
    if (document.getElementById("error-message")) {
      document.getElementById("error-message").remove();
    }
    resultFieldElement.appendChild(document.createElement("p"));
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
  sessionStorage.setItem('dates', JSON.stringify(dates))
  backBtn.removeEventListener("click", goToLandingPage);
  backBtn.addEventListener("click", loadBookingFirstForm);

  formFieldSectionElement.innerHTML = `<form>
    <p>
    <label for="booking-name">ჯავშნის დასახელება</label>
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
      <button>დაჯავშნა</button>
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
    formFieldSectionElement.firstElementChild.textContent = message;
    bookingBtn.style.display = "inline-block";
    backBtn.addEventListener('click', goToLandingPage)
  } else {
    if (!document.getElementById("error-message")) {
      formFieldSectionElement.insertBefore(
        document.createElement("p"),
        formFieldSectionElement.firstChild
      );
      formFieldSectionElement.firstElementChild.id = "error-message";
    }
    formFieldSectionElement.firstElementChild.textContent = message;
  }
}

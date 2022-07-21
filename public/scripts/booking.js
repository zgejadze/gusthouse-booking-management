const searchBtn = document.getElementById("search-btn");
const bookingBtn = document.getElementById("new-booking-btn");

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
  const backBtn = document.createElement("button");
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
function loadBookingForm() {
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

  const backBtn = document.getElementById("back-btn");
  if (backBtn) {
    backBtn.remove();
  }
  createBackBtn(bookingBtn.parentElement);

  formFieldSectionElement.firstElementChild.addEventListener(
    "submit",
    getFreeRooms
  );
}

bookingBtn.addEventListener("click", loadBookingForm);

/////////////////////////
////// get free rooms////
////////////////////////

async function getFreeRooms(event) {
  event.preventDefault();

  const enteredDates = {
    startDate: document.getElementById("date-start").value,
    endDate: document.getElementById("date-end").value,
  };

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
    formFieldSectionElement.firstElementChild.textContent = responseData.message;
  }else{
    document.getElementById("error-message").remove()
  }
  console.log(responseData);
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
